import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../services/api';
import { useGame } from '../context/GameContext';

export default function AICoach({ matchContext }) {
  const { addXP } = useGame();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);

  const suggestedTopics = ['RRR', 'Powerplay', 'Strike Rate', 'Wicket', 'Over'];

  const askQuestion = async (q) => {
    if (!q.trim() || isLoading) return;
    setIsLoading(true);
    setResponse(null);
    setQuizAnswered(false);
    setSelectedOpt(null);

    try {
      const res = await api.askCoach(q, matchContext);
      setResponse(res);
      setQuestion('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuiz = (optIndex) => {
    if (quizAnswered) return;
    setSelectedOpt(optIndex);
    setQuizAnswered(true);

    if (optIndex === response.quiz.correct) {
      addXP(response.quiz.xp || 30);
    }
  };

  return (
    <div className="coach-container">
      <div className="coach-header">
        <div className="coach-avatar">🤖</div>
        <div>
          <div className="coach-name">AI Cricket Coach</div>
          <div className="coach-status">Online • Ask me anything!</div>
        </div>
      </div>

      {!response && (
        <>
          <div className="text-xs text-muted mb-2">Suggested topics:</div>
          <div className="coach-topics">
            {suggestedTopics.map(topic => (
              <span 
                key={topic} 
                className="coach-topic"
                onClick={() => { setQuestion(topic); askQuestion(topic); }}
              >
                {topic}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="chat-input-container mb-2">
        <input
          type="text"
          className="chat-input"
          placeholder="What's a super over?"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && askQuestion(question)}
        />
        <button 
          className="btn btn-primary btn-icon" 
          onClick={() => askQuestion(question)}
          disabled={!question.trim() || isLoading}
        >
          <Send size={16} />
        </button>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
            <span className="text-muted text-sm">Coach is typing...</span>
          </motion.div>
        )}

        {response && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="coach-response">
              {response.answer}
            </div>

            {response.quiz && (
              <div className="coach-quiz">
                <div className="coach-quiz-question">{response.quiz.question}</div>
                <div className="coach-quiz-options">
                  {response.quiz.options.map((opt, i) => {
                    let cls = 'coach-quiz-option';
                    if (quizAnswered) {
                      if (i === response.quiz.correct) cls += ' correct';
                      else if (i === selectedOpt) cls += ' wrong';
                    }
                    return (
                      <div 
                        key={i} 
                        className={cls}
                        onClick={() => handleQuiz(i)}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>
                {quizAnswered && (
                  <div className="mt-3 text-center text-sm font-bold fade-in">
                    {selectedOpt === response.quiz.correct 
                      ? <span className="text-green flex justify-center items-center gap-1"><CheckCircle size={16}/> Correct! +{response.quiz.xp} XP</span>
                      : <span className="text-red flex justify-center items-center gap-1"><XCircle size={16}/> Not quite! It was {response.quiz.options[response.quiz.correct]}</span>
                    }
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
