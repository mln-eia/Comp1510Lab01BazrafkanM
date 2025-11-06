import { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase.js';
import DashboardHeader from './components/DashboardHeader.jsx';
import Quiz from './components/Quiz.jsx';
import ProgramsList from './components/ProgramsList.jsx';
import NewsFeed from './components/NewsFeed.jsx';
import GoalTracker from './components/GoalTracker.jsx';
import './App.css';

const USER_COLLECTION = 'users';
const PROGRAMS_COLLECTION = 'programs';
const NEWS_COLLECTION = 'news';
const GOALS_COLLECTION = 'goals';
const QUIZ_RESULTS_COLLECTION = 'quizResults';

export default function App() {
  const [userId, setUserId] = useState('demo-student');
  const [userProfile, setUserProfile] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [news, setNews] = useState([]);
  const [goals, setGoals] = useState([]);
  const [quizRecommendations, setQuizRecommendations] = useState([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const userRef = doc(db, USER_COLLECTION, userId);

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserProfile(snapshot.data());
      } else {
        setDoc(userRef, {
          displayName: 'Pathfinder Student',
          createdAt: serverTimestamp()
        });
      }
    });

    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    const programsQuery = query(collection(db, PROGRAMS_COLLECTION), orderBy('name'));
    const unsubscribe = onSnapshot(programsQuery, (snapshot) => {
      const next = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
      }));
      setPrograms(next);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const newsQuery = query(collection(db, NEWS_COLLECTION), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(newsQuery, (snapshot) => {
      const next = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
      }));
      setNews(next);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const goalsQuery = query(collection(db, GOALS_COLLECTION), orderBy('dueDate'));
    const unsubscribe = onSnapshot(goalsQuery, (snapshot) => {
      const next = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
      }));
      setGoals(next);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    const quizQuery = query(collection(db, QUIZ_RESULTS_COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(quizQuery, (snapshot) => {
      const results = snapshot.docs
        .filter((docSnapshot) => docSnapshot.data().userId === userId)
        .map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
      setQuizRecommendations(results);
    });

    return unsubscribe;
  }, [userId]);

  const latestRecommendation = useMemo(
    () => (quizRecommendations.length ? quizRecommendations[0] : null),
    [quizRecommendations]
  );

  const handleUserUpdate = async (nextProfile) => {
    setUserId(nextProfile.id);
    const userRef = doc(db, USER_COLLECTION, nextProfile.id);
    await setDoc(
      userRef,
      {
        displayName: nextProfile.displayName,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  };

  const handleQuizComplete = async (result) => {
    await addDoc(collection(db, QUIZ_RESULTS_COLLECTION), {
      userId,
      recommendations: result.recommendations,
      dominantTheme: result.dominantTheme,
      createdAt: serverTimestamp()
    });
  };

  const handleGoalCreate = async (goal) => {
    await addDoc(collection(db, GOALS_COLLECTION), {
      userId,
      ...goal,
      completed: false,
      createdAt: serverTimestamp()
    });
  };

  const handleGoalStatusChange = async (goalId, completed) => {
    const goalRef = doc(db, GOALS_COLLECTION, goalId);
    await updateDoc(goalRef, { completed, completedAt: completed ? serverTimestamp() : null });
  };

  return (
    <div className="app">
      <DashboardHeader
        userId={userId}
        profile={userProfile}
        latestRecommendation={latestRecommendation}
        onUpdateUser={handleUserUpdate}
      />
      <main className="layout">
        <section className="primary">
          <Quiz onComplete={handleQuizComplete} latestRecommendation={latestRecommendation} />
          <ProgramsList programs={programs} />
        </section>
        <section className="secondary">
          <NewsFeed news={news} />
          <GoalTracker
            goals={goals.filter((goal) => goal.userId === userId)}
            onCreate={handleGoalCreate}
            onStatusChange={handleGoalStatusChange}
          />
        </section>
      </main>
    </div>
  );
}
