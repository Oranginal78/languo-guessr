import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import LanguageSelector from './components/LanguageSelector';
import texts from './data/texts_full.json';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import bg1 from './images/fond1.png';
import bg2 from './images/fond2.png';
import bg3 from './images/fond3.png';
import bg4 from './images/fond4.png';
import bg5 from './images/fond5.png';
import bg6 from './images/fond6.png';
import bg7 from './images/fond7.png';


const TOTAL_ROUNDS = 6;
const TIME_GUESS = 30;
const TIME_TRANSLATE = 30;

const backgroundImages = [bg1, bg2, bg3, bg4, bg5, bg6];

function App() {
  const [background, setBackground] = useState('');
  const [screen, setScreen] = useState('home');
  const [selectedLanguages, setSelectedLanguages] = useState(null);
  const [difficulty, setDifficulty] = useState('normal');
  const [uiLanguage, setUiLanguage] = useState('en');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentText, setCurrentText] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_GUESS);
  const [timerRunning, setTimerRunning] = useState(false);
  const [awaitingTranslation, setAwaitingTranslation] = useState(false);
  const [userTranslation, setUserTranslation] = useState('');
  const [expectedTranslation, setExpectedTranslation] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');
  const [waitingNextRound, setWaitingNextRound] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const [errorFeedback, setErrorFeedback] = useState('');

  const languagesList = Array.from(new Set(texts.map(item => item.language))).sort();

  const pickRandomBackground = () => {
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setBackground(randomImage);
  };

  useEffect(() => {
    pickRandomBackground();
  }, []);

  useEffect(() => {
    if (selectedLanguages && !gameOver) {
      pickRandomText();
    }
  }, [selectedLanguages, currentRound]);

  useEffect(() => {
    let timer;
    if (timerRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timerRunning && timeLeft === 0) {
      if (awaitingTranslation) {
        handleTranslationTimeout();
      } else {
        handleGuessTimeout();
      }
    }
    return () => clearTimeout(timer);
  }, [timerRunning, timeLeft]);

  const handleStart = () => {
    pickRandomBackground();
    setScreen('languageSelector');
  };

  const handleLanguagesValidated = (languages, selectedDifficulty, selectedUiLanguage) => {
    setSelectedLanguages(languages);
    setDifficulty(selectedDifficulty);
    setUiLanguage(selectedUiLanguage);
    setScreen('game');
  };

  const pickRandomText = () => {
    const availableTexts = texts.filter(t => selectedLanguages.includes(t.language));
    const randomTextObj = availableTexts[Math.floor(Math.random() * availableTexts.length)];
    const difficultyTexts = randomTextObj[difficulty];
    const randomEntry = difficultyTexts[Math.floor(Math.random() * difficultyTexts.length)];

    setCurrentText({
      language: randomTextObj.language,
      text: randomEntry.text,
      translation: uiLanguage === 'en' ? randomEntry.translation_en : randomEntry.translation_fr
    });

    setTimeLeft(TIME_GUESS);
    setTimerRunning(true);
  };

  const handleGuess = (languageGuessed) => {
    setTimerRunning(false);

    if (languageGuessed === currentText.language) {
      setScore(prev => prev + 100);
      setCorrectAnswers(prev => prev + 1);
      setStreakCount(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, streakCount + 1));
      if (streakCount >= 3) {
        setFeedbackMessage(uiLanguage === 'en' ? `Streak! +200 points` : `Série ! +200 points`);
        setScore(prev => prev + 200);
      }
      setExpectedTranslation(currentText.translation);
      setAwaitingTranslation(true);
      setTimeLeft(TIME_TRANSLATE);
      setTimerRunning(true);
    } else {
      setFeedbackMessage(uiLanguage === 'en' ? `Wrong! It was ${translateLanguage(currentText.language)}. +0 points` : `Faux ! C'était ${translateLanguage(currentText.language)}. +0 points`);
      setFeedbackColor('red');
      setErrorFeedback(generateErrorFeedback(languageGuessed));
      setStreakCount(0);
      triggerNextRound();
    }
  };

  const handleGuessTimeout = () => {
    setTimerRunning(false);
    setFeedbackMessage(uiLanguage === 'en' ? "Time's up! +0 points" : "Temps écoulé ! +0 points");
    setFeedbackColor('red');
    triggerNextRound();
  };

  const handleTranslationTimeout = () => {
    setTimerRunning(false);
    setAwaitingTranslation(false);
    setFeedbackMessage(uiLanguage === 'en' ? "Translation time's up! +0 points" : "Temps écoulé pour la traduction ! +0 points");
    setFeedbackColor('red');
    triggerNextRound();
  };

  const handleTranslationSubmit = () => {
    setTimerRunning(false);

    const normalizedUser = userTranslation.trim().toLowerCase();
    const normalizedExpected = expectedTranslation.trim().toLowerCase();

    const similarity = getSimilarity(normalizedUser, normalizedExpected);

    if (similarity >= 0.7) {
      setScore(prev => prev + 200);
      setFeedbackMessage(uiLanguage === 'en' ? 'Good translation! +200 points' : 'Bonne traduction ! +200 points');
      setFeedbackColor('green');
    } else {
      setFeedbackMessage(uiLanguage === 'en' ? `Incorrect translation. Correct was: "${expectedTranslation}". +0 points` : `Traduction incorrecte. La bonne réponse était : "${expectedTranslation}". +0 points`);
      setFeedbackColor('red');
    }

    setAwaitingTranslation(false);
    setUserTranslation('');
    triggerNextRound();
  };

  const generateErrorFeedback = (guessedLanguage) => {
    const correct = currentText.language;
    return uiLanguage === 'en'
      ? `Your guess "${guessedLanguage}" was wrong. The correct language was "${correct}".`
      : `Votre réponse "${guessedLanguage}" est incorrecte. La bonne langue était "${correct}".`;
  };

  const translateLanguage = (lang) => {
    const found = languagesList.find(l => l.en === lang);
    return found ? (uiLanguage === 'en' ? found.en : found.fr) : lang;
  };

  const triggerNextRound = () => {
    setWaitingNextRound(true);
    setTimeout(() => {
      setWaitingNextRound(false);
      setFeedbackMessage('');
      setFeedbackColor('');
      if (currentRound >= TOTAL_ROUNDS) {
        setGameOver(true);
      } else {
        setCurrentRound(prev => prev + 1);
      }
    }, 2000);
  };

  const resetGame = () => {
    pickRandomBackground();
    setSelectedLanguages(null);
    setCurrentRound(1);
    setScore(0);
    setGameOver(false);
    setCurrentText(null);
    setTimeLeft(TIME_GUESS);
    setTimerRunning(false);
    setAwaitingTranslation(false);
    setUserTranslation('');
    setExpectedTranslation('');
    setFeedbackMessage('');
    setFeedbackColor('');
    setWaitingNextRound(false);
    setStreakCount(0);
    setBestStreak(0);
    setCorrectAnswers(0);
    setResponseTimes([]);
  };

  const getSimilarity = (a, b) => {
    let longer = a.length > b.length ? a : b;
    let shorter = a.length > b.length ? b : a;
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - editDistance(longer, shorter)) / longerLength;
  };

  const editDistance = (s1, s2) => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  if (!selectedLanguages) {
    if (screen === 'home') {
      return <Home onStart={handleStart} />;
    } else {
      return <LanguageSelector onValidate={handleLanguagesValidated} />;
    }
  }

  const backgroundStyle = { backgroundImage: `url("${background}")` };

  if (gameOver) {
    return (
      <div className="app w-full min-h-screen px-4 flex items-center justify-center" style={backgroundStyle}>
        <div className="glass-box mx-auto w-full max-w-2xl px-4 text-center">
          <h1>{uiLanguage === 'en' ? 'Game Over!' : 'Partie terminée !'}</h1>
          <p>{uiLanguage === 'en' ? 'Final Score:' : 'Score final :'} {score}</p>
          <p>{uiLanguage === 'en' ? 'Total Correct Answers:' : 'Réponses Correctes :'} {correctAnswers}</p>
          <p>{uiLanguage === 'en' ? 'Best Streak:' : 'Meilleure Série :'} {bestStreak}</p>
          <button onClick={resetGame} className="button">
            {uiLanguage === 'en' ? 'Return to Menu' : 'Retour au menu'}
          </button>
          <a href="/about" className="lab-link">Oranginal AI Lab</a>
        </div>
      </div>
    );
  }

  if (awaitingTranslation) {
    return (
      <div className="app w-full min-h-screen px-4 flex items-center justify-center" style={backgroundStyle}>
        <div className="glass-box mx-auto w-full max-w-2xl px-4 text-center">
          <div className="nav-buttons">
            <button onClick={resetGame} className="button button-secondary">
              {uiLanguage === 'en' ? 'Return to Menu' : 'Retour au menu'}
            </button>
            <a href="/about" className="lab-link">Oranginal AI Lab</a>
          </div>
          <h2>{uiLanguage === 'en' ? 'Translation Bonus!' : 'Bonus Traduction !'}</h2>
          <p>{uiLanguage === 'en' ? 'Translate this to English:' : 'Traduisez ceci en français :'}</p>
          <p className="highlight-text text-center">{currentText.text}</p>
          <h3>{uiLanguage === 'en' ? 'Time Left:' : 'Temps restant :'} {timeLeft}s</h3>
          <input
            type="text"
            value={userTranslation}
            onChange={(e) => setUserTranslation(e.target.value)}
            placeholder={uiLanguage === 'en' ? 'Write your translation here...' : 'Écrivez votre traduction ici...'}
            className="input"
          />
          <br />
          <button onClick={handleTranslationSubmit} className="button">
            {uiLanguage === 'en' ? 'Submit Translation or skip ' : 'Valider la traduction ou passer'}
          </button>
          <p className="copyright">© Oranginal</p>
        </div>
      </div>
    );
  }

  if (!currentText) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app w-full min-h-screen px-4 flex items-center justify-center" style={backgroundStyle}>
      <div className="glass-box mx-auto w-full max-w-2xl px-4 text-center">
        <div className="nav-buttons">
          <button onClick={resetGame} className="button button-secondary">
            {uiLanguage === 'en' ? 'Return to Menu' : 'Retour au menu'}
          </button>
          <a href="/about" className="lab-link">Oranginal AI Lab</a>
        </div>

        <h2>Round {currentRound} / {TOTAL_ROUNDS}</h2>
        <h3>{uiLanguage === 'en' ? 'Score:' : 'Score :'} {score}</h3>
        <h3>{uiLanguage === 'en' ? 'Streak:' : 'Série :'} {streakCount}</h3>
        <h3>{uiLanguage === 'en' ? 'Time Left:' : 'Temps restant :'} {timeLeft}s</h3>

        {feedbackMessage && (
          <div className={`feedback ${feedbackColor}`}>{feedbackMessage}</div>
        )}

        <p className="highlight-text text-center">{currentText.text}</p>

        <div className="choices">
          {selectedLanguages.map(lang => (
            <button
              key={lang}
              onClick={() => handleGuess(lang)}
              disabled={waitingNextRound}
              className="choice-button"
            >
              {translateLanguage(lang)}
            </button>
          ))}
        </div>

        {/* ✅ Skip button déplacé + bon style + effet immédiat */}
        <div className="start-button-container">
          <button
            onClick={handleGuessTimeout}
            disabled={waitingNextRound}
            className="start-button-futuristic"
          >
            {uiLanguage === 'en' ? 'Skip' : 'Passer'}
          </button>
        </div>


        <p className="copyright mt-4">© Oranginal</p>
      </div>
    </div>
  );
}

export default App;