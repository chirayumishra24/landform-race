'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { TopNavBar } from '@/components/game/TopNavBar';
import { TeamQuestionPanel } from '@/components/game/TeamQuestionPanel';
import { RaceProgressPanel } from '@/components/game/RaceProgressPanel';
import { TopographicMapView } from '@/components/game/TopographicMapView';
import { LandmarkCard } from '@/components/game/LandmarkCard';
import { StartScreen } from '@/components/game/StartScreen';
import { ResultsScreen } from '@/components/game/ResultsScreen';
import { MissedQuestionsReview } from '@/components/game/MissedQuestionsReview';
import { EducationalExplorerModal } from '@/components/game/EducationalExplorerModal';
import { TeacherDashboard } from '@/components/game/TeacherDashboard';
import { INITIAL_QUESTIONS, ZONE_CONFIGS } from '@/data/questions';
import { sound } from '@/utils/audio';
import {
  GameStatus,
  LandformZone,
  Question,
  TeamProgress,
  ZoneConfig
} from '@/types/game';

// Dynamically import 3D DioramaCanvas without SSR for WebGL safety
const DioramaCanvas = dynamic(
  () => import('@/components/3d/DioramaCanvas').then((mod) => mod.DioramaCanvas),
  { ssr: false }
);

function getZoneForCheckpoint(checkpoint: number): LandformZone {
  if (checkpoint <= 3) return 'mountains';
  if (checkpoint <= 6) return 'valley';
  if (checkpoint <= 9) return 'plateau';
  if (checkpoint <= 12) return 'plains';
  if (checkpoint <= 14) return 'river';
  return 'settlement';
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function LandformRacersPage() {
  // Game states
  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  const [matchTime, setMatchTime] = useState<number>(300); // 5 minutes
  const [countdownNum, setCountdownNum] = useState<number | string>(3);
  const [winner, setWinner] = useState<'blue' | 'orange' | 'tie' | null>(null);

  // Settings & Toggles
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d' | 'map'>('3d');
  const [cameraMode, setCameraMode] = useState<'overview' | 'chase'>('overview');

  // Modals & Panels
  const [showReview, setShowReview] = useState<boolean>(false);
  const [showExplorer, setShowExplorer] = useState<boolean>(false);
  const [showTeacher, setShowTeacher] = useState<boolean>(false);
  const [explorerZone, setExplorerZone] = useState<LandformZone>('mountains');

  // Camera hint
  const [hintZone, setHintZone] = useState<LandformZone | null>(null);

  // Landmark transition card
  const [landmarkPopup, setLandmarkPopup] = useState<{
    zone: ZoneConfig;
    teamColor: 'blue' | 'orange';
  } | null>(null);

  // Question bank
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

  // Question queues for both teams
  const [blueQueue, setBlueQueue] = useState<Question[]>([]);
  const [orangeQueue, setOrangeQueue] = useState<Question[]>([]);

  // Team 1: North Star
  const [blueTeam, setBlueTeam] = useState<TeamProgress>({
    teamId: 'blue',
    teamName: 'Team North Star',
    tagline: 'Explore • Answer • Advance',
    color: 'blue',
    score: 0,
    checkpoint: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    selectedOption: null,
    hasSubmitted: false,
    isCorrect: null,
    streak: 0,
    maxStreak: 0,
    fiftyFiftyRemaining: 1,
    landscapeHintsRemaining: 2,
    eliminatedOptions: [],
    currentZone: 'mountains',
    isMoving: false,
    isBoosting: false,
    answeredQuestionsHistory: []
  });

  // Team 2: Earth Explorers
  const [orangeTeam, setOrangeTeam] = useState<TeamProgress>({
    teamId: 'orange',
    teamName: 'Team Earth Explorers',
    tagline: 'Find • Analyse • Move Forward',
    color: 'orange',
    score: 0,
    checkpoint: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    selectedOption: null,
    hasSubmitted: false,
    isCorrect: null,
    streak: 0,
    maxStreak: 0,
    fiftyFiftyRemaining: 1,
    landscapeHintsRemaining: 2,
    eliminatedOptions: [],
    currentZone: 'mountains',
    isMoving: false,
    isBoosting: false,
    answeredQuestionsHistory: []
  });

  // Initialize queues on game start
  const startNewRace = useCallback(() => {
    sound.playClick();
    const enabledQuestions = questions.filter((q) => q.enabled !== false);
    const shuffled1 = shuffleArray(enabledQuestions);
    const shuffled2 = shuffleArray(enabledQuestions);

    setBlueQueue(shuffled1);
    setOrangeQueue(shuffled2);

    setBlueTeam((prev) => ({
      ...prev,
      score: 0,
      checkpoint: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      selectedOption: null,
      hasSubmitted: false,
      isCorrect: null,
      streak: 0,
      maxStreak: 0,
      fiftyFiftyRemaining: 1,
      landscapeHintsRemaining: 2,
      eliminatedOptions: [],
      currentZone: 'mountains',
      isMoving: false,
      isBoosting: false,
      answeredQuestionsHistory: []
    }));

    setOrangeTeam((prev) => ({
      ...prev,
      score: 0,
      checkpoint: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      selectedOption: null,
      hasSubmitted: false,
      isCorrect: null,
      streak: 0,
      maxStreak: 0,
      fiftyFiftyRemaining: 1,
      landscapeHintsRemaining: 2,
      eliminatedOptions: [],
      currentZone: 'mountains',
      isMoving: false,
      isBoosting: false,
      answeredQuestionsHistory: []
    }));

    setWinner(null);
    setMatchTime(300);
    setGameStatus('countdown');
    setCountdownNum(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
        sound.playClick();
      } else if (count === 0) {
        setCountdownNum('RACE!');
        sound.playBoost();
      } else {
        clearInterval(interval);
        setGameStatus('playing');
      }
    }, 1000);
  }, [questions]);

  // Match timer loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setMatchTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time expired: Determine winner
          finishRace('time_expired');
          return 0;
        }
        if (prev === 60) {
          sound.playTimerWarning();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  // Finish race handler
  const finishRace = useCallback(
    (reason: 'checkpoint_15' | 'time_expired', winnerTeamId?: 'blue' | 'orange') => {
      sound.playFanfare();
      setGameStatus('finished');

      if (winnerTeamId) {
        setWinner(winnerTeamId);
        return;
      }

      // Tie breaker stats
      if (blueTeam.checkpoint > orangeTeam.checkpoint) {
        setWinner('blue');
      } else if (orangeTeam.checkpoint > blueTeam.checkpoint) {
        setWinner('orange');
      } else {
        // Equal checkpoints -> tie breaks: accuracy, score, maxStreak
        const blueAcc = blueTeam.totalAnswers ? blueTeam.correctAnswers / blueTeam.totalAnswers : 0;
        const orgAcc = orangeTeam.totalAnswers ? orangeTeam.correctAnswers / orangeTeam.totalAnswers : 0;
        if (blueAcc > orgAcc) {
          setWinner('blue');
        } else if (orgAcc > blueAcc) {
          setWinner('orange');
        } else if (blueTeam.score > orangeTeam.score) {
          setWinner('blue');
        } else if (orangeTeam.score > blueTeam.score) {
          setWinner('orange');
        } else {
          setWinner('tie');
        }
      }
    },
    [blueTeam, orangeTeam]
  );

  // Check victory condition
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    if (blueTeam.checkpoint >= 15) {
      finishRace('checkpoint_15', 'blue');
    } else if (orangeTeam.checkpoint >= 15) {
      finishRace('checkpoint_15', 'orange');
    }
  }, [blueTeam.checkpoint, orangeTeam.checkpoint, gameStatus, finishRace]);

  // Team 1: Blue Option Select
  const handleBlueSelectOption = (idx: number) => {
    sound.playClick();
    setBlueTeam((prev) => ({ ...prev, selectedOption: idx }));
  };

  // Team 2: Orange Option Select
  const handleOrangeSelectOption = (idx: number) => {
    sound.playClick();
    setOrangeTeam((prev) => ({ ...prev, selectedOption: idx }));
  };

  // Team 1: Blue Submit Answer
  const handleBlueSubmit = () => {
    if (blueTeam.selectedOption === null || blueTeam.hasSubmitted) return;
    const currentQ = blueQueue[0];
    if (!currentQ) return;

    const isCorrect = blueTeam.selectedOption === currentQ.correctAnswer;
    const nextStreak = isCorrect ? blueTeam.streak + 1 : 0;
    const isNitroRush = nextStreak >= 3;
    const isBoosting = nextStreak >= 2;
    const advance = isCorrect ? (isNitroRush ? 2 : 1) : 0;
    const nextScore = blueTeam.score + (isCorrect ? (isNitroRush ? 300 : isBoosting ? 200 : 100) : 0);
    const nextCheckpoint = isCorrect ? Math.min(15, blueTeam.checkpoint + advance) : blueTeam.checkpoint;
    const nextZone = getZoneForCheckpoint(nextCheckpoint);

    // Audio trigger
    if (isCorrect) {
      sound.playCorrect();
      setTimeout(() => sound.playDrive(), 250);
      if (isNitroRush || isBoosting) sound.playBoost();
      if (nextCheckpoint >= 15) sound.playFanfare();
      else if (advance > 1 || nextZone !== blueTeam.currentZone) sound.playCheckpoint();
    } else {
      sound.playWrong();
    }

    // Check if new landform discovered
    if (isCorrect && nextZone !== blueTeam.currentZone) {
      const zConfig = ZONE_CONFIGS.find((z) => z.id === nextZone);
      if (zConfig) {
        setLandmarkPopup({ zone: zConfig, teamColor: 'blue' });
      }
    }

    setBlueTeam((prev) => ({
      ...prev,
      hasSubmitted: true,
      isCorrect,
      score: nextScore,
      checkpoint: nextCheckpoint,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalAnswers: prev.totalAnswers + 1,
      streak: nextStreak,
      maxStreak: Math.max(prev.maxStreak, nextStreak),
      currentZone: nextZone,
      isMoving: isCorrect,
      isBoosting,
      answeredQuestionsHistory: [
        ...prev.answeredQuestionsHistory,
        { question: currentQ, selectedOption: prev.selectedOption!, isCorrect }
      ]
    }));

    // Auto advance question after 2.8 seconds
    setTimeout(() => {
      setBlueQueue((prevQueue) => prevQueue.slice(1));
      setBlueTeam((prev) => ({
        ...prev,
        selectedOption: null,
        hasSubmitted: false,
        isCorrect: null,
        eliminatedOptions: [],
        isMoving: false,
        isBoosting: false
      }));
    }, 2800);
  };

  // Team 2: Orange Submit Answer
  const handleOrangeSubmit = () => {
    if (orangeTeam.selectedOption === null || orangeTeam.hasSubmitted) return;
    const currentQ = orangeQueue[0];
    if (!currentQ) return;

    const isCorrect = orangeTeam.selectedOption === currentQ.correctAnswer;
    const nextStreak = isCorrect ? orangeTeam.streak + 1 : 0;
    const isNitroRush = nextStreak >= 3;
    const isBoosting = nextStreak >= 2;
    const advance = isCorrect ? (isNitroRush ? 2 : 1) : 0;
    const nextScore = orangeTeam.score + (isCorrect ? (isNitroRush ? 300 : isBoosting ? 200 : 100) : 0);
    const nextCheckpoint = isCorrect ? Math.min(15, orangeTeam.checkpoint + advance) : orangeTeam.checkpoint;
    const nextZone = getZoneForCheckpoint(nextCheckpoint);

    // Audio trigger
    if (isCorrect) {
      sound.playCorrect();
      setTimeout(() => sound.playDrive(), 250);
      if (isNitroRush || isBoosting) sound.playBoost();
      if (nextCheckpoint >= 15) sound.playFanfare();
      else if (advance > 1 || nextZone !== orangeTeam.currentZone) sound.playCheckpoint();
    } else {
      sound.playWrong();
    }

    // Check if new landform discovered
    if (isCorrect && nextZone !== orangeTeam.currentZone) {
      const zConfig = ZONE_CONFIGS.find((z) => z.id === nextZone);
      if (zConfig) {
        setLandmarkPopup({ zone: zConfig, teamColor: 'orange' });
      }
    }

    setOrangeTeam((prev) => ({
      ...prev,
      hasSubmitted: true,
      isCorrect,
      score: nextScore,
      checkpoint: nextCheckpoint,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalAnswers: prev.totalAnswers + 1,
      streak: nextStreak,
      maxStreak: Math.max(prev.maxStreak, nextStreak),
      currentZone: nextZone,
      isMoving: isCorrect,
      isBoosting,
      answeredQuestionsHistory: [
        ...prev.answeredQuestionsHistory,
        { question: currentQ, selectedOption: prev.selectedOption!, isCorrect }
      ]
    }));

    // Auto advance question after 2.8 seconds
    setTimeout(() => {
      setOrangeQueue((prevQueue) => prevQueue.slice(1));
      setOrangeTeam((prev) => ({
        ...prev,
        selectedOption: null,
        hasSubmitted: false,
        isCorrect: null,
        eliminatedOptions: [],
        isMoving: false,
        isBoosting: false
      }));
    }, 2800);
  };

  // Team 1: 50/50 Power-up
  const handleBlueFiftyFifty = () => {
    if (blueTeam.fiftyFiftyRemaining <= 0 || blueTeam.hasSubmitted) return;
    const currentQ = blueQueue[0];
    if (!currentQ) return;

    sound.playBoost();
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQ.correctAnswer);
    const eliminated = shuffleArray(wrongIndices).slice(0, 2);

    setBlueTeam((prev) => ({
      ...prev,
      fiftyFiftyRemaining: prev.fiftyFiftyRemaining - 1,
      eliminatedOptions: eliminated
    }));
  };

  // Team 2: 50/50 Power-up
  const handleOrangeFiftyFifty = () => {
    if (orangeTeam.fiftyFiftyRemaining <= 0 || orangeTeam.hasSubmitted) return;
    const currentQ = orangeQueue[0];
    if (!currentQ) return;

    sound.playBoost();
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQ.correctAnswer);
    const eliminated = shuffleArray(wrongIndices).slice(0, 2);

    setOrangeTeam((prev) => ({
      ...prev,
      fiftyFiftyRemaining: prev.fiftyFiftyRemaining - 1,
      eliminatedOptions: eliminated
    }));
  };

  // Landscape Hint trigger (temporarily zooms/highlights terrain zone for 4s)
  const handleLandscapeHint = (teamColor: 'blue' | 'orange') => {
    const queue = teamColor === 'blue' ? blueQueue : orangeQueue;
    const currentQ = queue[0];
    if (!currentQ) return;

    sound.playBoost();
    const target = currentQ.terrainFocus || 'mountains';
    setHintZone(target);

    if (teamColor === 'blue') {
      setBlueTeam((prev) => ({
        ...prev,
        landscapeHintsRemaining: prev.landscapeHintsRemaining - 1
      }));
    } else {
      setOrangeTeam((prev) => ({
        ...prev,
        landscapeHintsRemaining: prev.landscapeHintsRemaining - 1
      }));
    }

    setTimeout(() => {
      setHintZone(null);
    }, 4000);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Audio toggle
  const toggleAudio = () => {
    const muted = sound.toggleMute();
    setIsAudioMuted(muted);
  };

  // Active Zone to focus camera
  const dominantZone =
    blueTeam.checkpoint >= orangeTeam.checkpoint
      ? blueTeam.currentZone
      : orangeTeam.currentZone;

  return (
    <main className="w-screen h-screen relative flex flex-col justify-between p-3 select-none overflow-hidden">
      {/* 1. TOP NAVIGATION BAR */}
      <TopNavBar
        round={Math.max(blueTeam.checkpoint, orangeTeam.checkpoint, 1)}
        totalRounds={15}
        matchTimeSeconds={matchTime}
        isAudioMuted={isAudioMuted}
        onToggleAudio={toggleAudio}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === '3d' ? 'map' : '3d')}
        cameraMode={cameraMode}
        onToggleCameraMode={() => setCameraMode(prev => prev === 'overview' ? 'chase' : 'overview')}
        onResetMatch={startNewRace}
        onOpenExplorer={() => setShowExplorer(true)}
        onOpenTeacher={() => setShowTeacher(true)}
        blueCheckpoint={blueTeam.checkpoint}
        orangeCheckpoint={orangeTeam.checkpoint}
      />

      {/* 2. MAIN 3-COLUMN HERO CONTENT (30% Blue, 40% Terrain, 30% Orange) */}
      <div className="flex-1 w-full my-2.5 flex gap-3 min-h-0 relative">
        {/* LEFT COLUMN: Team North Star (Blue) */}
        <div className="w-[31%] h-full min-h-0 flex flex-col shrink-0">
          <TeamQuestionPanel
            team={blueTeam}
            question={blueQueue[0] || null}
            onSelectOption={handleBlueSelectOption}
            onSubmitAnswer={handleBlueSubmit}
            onUseFiftyFifty={handleBlueFiftyFifty}
            onUseLandscapeHint={() => handleLandscapeHint('blue')}
            disabled={gameStatus !== 'playing'}
          />
        </div>

        {/* CENTER HERO: 3D Realistic Landform Diorama / Topographic Map */}
        <div className="flex-1 h-full min-h-0 relative clay-card rounded-3xl p-1.5 shadow-clay-card border-2 border-white/95 overflow-hidden">
          {/* Active Peek Map Hint Notification Banner */}
          {hintZone && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-full bg-slate-900/90 text-white border border-sky-400 shadow-2xl flex items-center gap-2 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="font-black text-xs uppercase tracking-wider">
                LOOK AT THE TERRAIN: {hintZone.toUpperCase()}
              </span>
            </div>
          )}

          {viewMode === '3d' ? (
            <DioramaCanvas
              blueTeam={blueTeam}
              orangeTeam={orangeTeam}
              activeZone={dominantZone}
              hintZone={hintZone}
              allowOrbit={false}
              cameraMode={cameraMode}
              onSelectZone={(zoneId) => {
                setExplorerZone(zoneId);
                setShowExplorer(true);
              }}
            />
          ) : (
            <TopographicMapView blueTeam={blueTeam} orangeTeam={orangeTeam} />
          )}
        </div>

        {/* RIGHT COLUMN: Team Earth Explorers (Orange) */}
        <div className="w-[31%] h-full min-h-0 flex flex-col shrink-0">
          <TeamQuestionPanel
            team={orangeTeam}
            question={orangeQueue[0] || null}
            onSelectOption={handleOrangeSelectOption}
            onSubmitAnswer={handleOrangeSubmit}
            onUseFiftyFifty={handleOrangeFiftyFifty}
            onUseLandscapeHint={() => handleLandscapeHint('orange')}
            disabled={gameStatus !== 'playing'}
          />
        </div>
      </div>

      {/* 3. BOTTOM RACE PROGRESS PANEL */}
      <RaceProgressPanel
        blueTeam={blueTeam}
        orangeTeam={orangeTeam}
        onSelectZoneToView={(zoneId) => {
          setExplorerZone(zoneId as LandformZone);
          setShowExplorer(true);
        }}
      />

      {/* 4. LANDMARK TRANSITION OVERLAY CARD */}
      {landmarkPopup && (
        <LandmarkCard
          zone={landmarkPopup.zone}
          teamColor={landmarkPopup.teamColor}
          onDismiss={() => setLandmarkPopup(null)}
        />
      )}

      {/* 5. COUNTDOWN MODAL */}
      {gameStatus === 'countdown' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md select-none">
          <div className="text-center animate-scaleIn">
            <span className="text-xs font-black uppercase tracking-widest text-sky-400 block mb-2">
              EXPEDITION COMMENCING
            </span>
            <div className="text-8xl md:text-9xl font-black font-heading text-white drop-shadow-[0_10px_25px_rgba(2,132,199,0.8)]">
              {countdownNum}
            </div>
            <p className="text-white/80 font-bold text-lg mt-4">
              RACE ACROSS THE LANDFORMS!
            </p>
          </div>
        </div>
      )}

      {/* 6. START SCREEN */}
      {gameStatus === 'setup' && (
        <StartScreen
          onStartGame={startNewRace}
          onOpenTeacher={() => setShowTeacher(true)}
          onOpenExplorer={() => setShowExplorer(true)}
        />
      )}

      {/* 7. RESULTS SCREEN */}
      {gameStatus === 'finished' && (
        <ResultsScreen
          winner={winner}
          blueTeam={blueTeam}
          orangeTeam={orangeTeam}
          onPlayAgain={startNewRace}
          onOpenReview={() => setShowReview(true)}
          onOpenExplorer={() => setShowExplorer(true)}
        />
      )}

      {/* 8. MISSED QUESTIONS REVIEW MODAL */}
      {showReview && (
        <MissedQuestionsReview
          blueTeam={blueTeam}
          orangeTeam={orangeTeam}
          onClose={() => setShowReview(false)}
        />
      )}

      {/* 9. EDUCATIONAL EXPLORER MODAL */}
      {showExplorer && (
        <EducationalExplorerModal
          initialZone={explorerZone}
          onSelectZone={(z) => setHintZone(z)}
          onClose={() => setShowExplorer(false)}
        />
      )}

      {/* 10. TEACHER DASHBOARD MODAL */}
      {showTeacher && (
        <TeacherDashboard
          questions={questions}
          onAddQuestion={(newQ) => {
            const created: Question = { ...newQ, id: `custom-${Date.now()}` };
            setQuestions((prev) => [created, ...prev]);
          }}
          onUpdateQuestion={(id, updated) => {
            setQuestions((prev) =>
              prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
            );
          }}
          onDeleteQuestion={(id) => {
            setQuestions((prev) => prev.filter((q) => q.id !== id));
          }}
          onToggleQuestionEnabled={(id) => {
            setQuestions((prev) =>
              prev.map((q) =>
                q.id === id ? { ...q, enabled: q.enabled === false ? true : false } : q
              )
            );
          }}
          onClose={() => setShowTeacher(false)}
        />
      )}
    </main>
  );
}
