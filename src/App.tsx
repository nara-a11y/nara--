import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Activity, Skull, Coffee, Home, AlertTriangle, X, Minus, Square, Zap } from 'lucide-react';

type GameState = 'start' | 'playing' | 'end';

interface Option {
  text: string;
  mentalDelta: number;
  bpDelta: number;
}

interface Question {
  id: number;
  relative: string;
  avatar: string;
  text: string;
  options: Option[];
}

const allQuestions: Question[] = [
  {
    id: 1,
    relative: "二姑",
    avatar: "👩‍🦱",
    text: "哎呀，妮儿，27了还不找对象？你表妹二胎都抱上了！",
    options: [
      { text: "缘分还没到，不着急。", mentalDelta: -15, bpDelta: 0 },
      { text: "上海消费高，养不起男人。", mentalDelta: 10, bpDelta: 20 },
      { text: "二姑，我其实已经出家了，法号智深。", mentalDelta: 30, bpDelta: 50 }
    ]
  },
  {
    id: 2,
    relative: "三大爷",
    avatar: "👴",
    text: "在上海一个月能挣多少钱啊？能买得起房吗？",
    options: [
      { text: "够吃够喝，挺好的。", mentalDelta: -15, bpDelta: 0 },
      { text: "不多，也就比三大爷您退休金多一点。", mentalDelta: 20, bpDelta: 30 },
      { text: "我准备去黄浦江边捡瓶子，三大爷要一起吗？", mentalDelta: 30, bpDelta: 40 }
    ]
  },
  {
    id: 3,
    relative: "大舅妈",
    avatar: "👵",
    text: "女孩子在外面漂着多辛苦，回山西考个公务员多安稳！",
    options: [
      { text: "上海机会多，我还想再闯闯。", mentalDelta: -15, bpDelta: 0 },
      { text: "大舅妈，您给我安排个局长当当我就回。", mentalDelta: 20, bpDelta: 30 },
      { text: "不行啊舅妈，上海的咖啡里有迷魂药，我一天不喝就浑身难受。", mentalDelta: 40, bpDelta: 40 }
    ]
  },
  {
    id: 4,
    relative: "远房表叔",
    avatar: "👨‍🦲",
    text: "听说你在做那个什么...互联网？是不是天天加班会秃头啊？",
    options: [
      { text: "还行，注意休息就好。", mentalDelta: -15, bpDelta: 0 },
      { text: "表叔您这发际线，看着也不像没加过班的啊。", mentalDelta: 30, bpDelta: 40 },
      { text: "我已经把头剃光了，现在是个光头强，天天在公司砍树。", mentalDelta: 40, bpDelta: 50 }
    ]
  },
  {
    id: 5,
    relative: "小表弟",
    avatar: "👦",
    text: "姐，你能给我买个最新款的PS5吗？你都在大城市上班了！",
    options: [
      { text: "姐最近手头紧，下次吧。", mentalDelta: -15, bpDelta: 0 },
      { text: "给你买几套五年高考三年模拟吧，对你好。", mentalDelta: 20, bpDelta: 30 },
      { text: "姐在上海要饭呢，你能不能借姐两百块钱？", mentalDelta: 30, bpDelta: 40 }
    ]
  },
  {
    id: 6,
    relative: "七大姑",
    avatar: "🧓",
    text: "你这穿的什么衣服啊，破破烂烂的，在上海就穿这个？",
    options: [
      { text: "这是今年的流行款式，复古风。", mentalDelta: -10, bpDelta: 0 },
      { text: "姑，这叫Y2K废土风，您不懂，这衣服比您那貂还贵呢。", mentalDelta: 15, bpDelta: 35 },
      { text: "实不相瞒，我在上海加入了丐帮，这是我的九袋长老服。", mentalDelta: 35, bpDelta: 45 }
    ]
  },
  {
    id: 7,
    relative: "隔壁王阿姨",
    avatar: "👱‍♀️",
    text: "哎哟，我家儿子今年刚考上老家的事业编，你还在外面打工啊？",
    options: [
      { text: "挺好的，恭喜恭喜。", mentalDelta: -20, bpDelta: 0 },
      { text: "那挺好，以后我回老家办证就找他走后门了啊。", mentalDelta: 10, bpDelta: 25 },
      { text: "阿姨，我在上海给外星人打工，包吃包住还发飞碟呢。", mentalDelta: 40, bpDelta: 50 }
    ]
  },
  {
    id: 8,
    relative: "四表叔",
    avatar: "🧔",
    text: "你一个女孩子读那么多书有什么用，最后还不是要嫁人洗衣服做饭？",
    options: [
      { text: "现在时代不同了，女孩子也要有自己的事业。", mentalDelta: -15, bpDelta: 0 },
      { text: "四表叔，您家洗衣机坏了吗？要不我给您买个全自动的？", mentalDelta: 25, bpDelta: 40 },
      { text: "读书是为了让我能心平气和地跟您说话，不然我早就动手了。", mentalDelta: 45, bpDelta: 60 }
    ]
  },
  {
    id: 9,
    relative: "小姑父",
    avatar: "👨‍💼",
    text: "你们年轻人就是吃不了苦，我们当年一天干十几个小时都不喊累！",
    options: [
      { text: "是啊，现在压力确实大。", mentalDelta: -15, bpDelta: 0 },
      { text: "姑父，您当年房价多少，现在房价多少啊？", mentalDelta: 20, bpDelta: 45 },
      { text: "姑父说得对，所以我决定明天就去工地搬砖，您来给我当包工头吧！", mentalDelta: 35, bpDelta: 35 }
    ]
  },
  {
    id: 10,
    relative: "堂姐",
    avatar: "👩‍💼",
    text: "你这脸怎么看着这么憔悴啊？是不是上海水土不服？要不用用我代理的这个微商面膜？",
    options: [
      { text: "最近加班有点多，没休息好。", mentalDelta: -10, bpDelta: 0 },
      { text: "姐，你这面膜三无产品吧，我怕烂脸。", mentalDelta: 15, bpDelta: 40 },
      { text: "其实我不是憔悴，我是修仙到了瓶颈期，正在渡劫。", mentalDelta: 40, bpDelta: 30 }
    ]
  },
  {
    id: 11,
    relative: "二大爷",
    avatar: "🧓",
    text: "听说上海人排外得很，你一个外地人在那受了不少气吧？",
    options: [
      { text: "还行，同事朋友都挺好的。", mentalDelta: -10, bpDelta: 0 },
      { text: "二大爷，我在那天天说山西话，他们都以为我是煤老板女儿，对我可客气了。", mentalDelta: 25, bpDelta: 30 },
      { text: "没有啊，我已经把他们都同化了，现在我们公司开会都吃刀削面。", mentalDelta: 35, bpDelta: 40 }
    ]
  },
  {
    id: 12,
    relative: "三舅",
    avatar: "👨‍🌾",
    text: "你这大城市回来的，怎么连个车都没买？隔壁小李在县城都开上宝马了！",
    options: [
      { text: "上海地铁方便，不需要买车。", mentalDelta: -10, bpDelta: 0 },
      { text: "三舅，我在上海有专职司机，每天开几千万的车接送我（指地铁）。", mentalDelta: 20, bpDelta: 25 },
      { text: "买车干嘛？我平时出门都御剑飞行，低碳环保不堵车。", mentalDelta: 40, bpDelta: 50 }
    ]
  }
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [mentalState, setMentalState] = useState(100);
  const [relativeBP, setRelativeBP] = useState(80);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleStart = () => {
    // Randomly select 5 questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    
    setGameState('playing');
    setCurrentQIndex(0);
    setMentalState(100);
    setRelativeBP(80);
  };

  const handleOptionClick = (option: Option) => {
    const newMental = Math.min(100, Math.max(0, mentalState + option.mentalDelta));
    const newBP = Math.min(200, Math.max(0, relativeBP + option.bpDelta));
    
    setMentalState(newMental);
    setRelativeBP(newBP);
    
    let fbText = '';
    if (option.mentalDelta > 0) fbText += `精神状态 +${option.mentalDelta} `;
    else if (option.mentalDelta < 0) fbText += `精神状态 ${option.mentalDelta} `;
    
    if (option.bpDelta > 0) fbText += `亲戚血压 +${option.bpDelta}`;
    
    setFeedbackText(fbText);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      
      if (newMental <= 0 || newBP >= 200 || currentQIndex >= questions.length - 1) {
        setGameState('end');
      } else {
        setCurrentQIndex(prev => prev + 1);
      }
    }, 1500);
  };

  const getEnding = () => {
    if (mentalState <= 0) {
      return {
        title: "内耗王者",
        desc: "你选择了隐忍，但你的精神防线彻底崩溃了。你决定明天就买车票逃回上海加班。",
        icon: <Skull className="w-16 h-16 text-rose-500 mb-4" />
      };
    } else if (relativeBP >= 200) {
      return {
        title: "发疯达人",
        desc: "你成功用魔法打败了魔法！亲戚们被你的抽象发言震惊，再也不敢问你问题了。你赢得了清净的春节！",
        icon: <Zap className="w-16 h-16 text-yellow-500 mb-4" />
      };
    } else {
      return {
        title: "端水大师",
        desc: "你巧妙地在发疯和礼貌之间找到了平衡，既没有气死亲戚，也没有憋屈自己。平稳度过春节！",
        icon: <Coffee className="w-16 h-16 text-amber-700 mb-4" />
      };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="retro-window p-1"
            >
              <div className="retro-title-bar">
                <span>Simulator.exe</span>
                <div className="flex gap-2">
                  <Minus className="w-4 h-4 cursor-pointer" />
                  <Square className="w-4 h-4 cursor-pointer" />
                  <X className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
              <div className="p-8 text-center flex flex-col items-center">
                <Home className="w-16 h-16 text-rose-500 mb-4" />
                <h1 className="text-3xl font-bold mb-2 text-rose-600">春节亲戚脱敏模拟器</h1>
                <p className="text-rose-800 mb-8 max-w-md leading-relaxed">
                  你，27岁，山西长大，现居上海（沪漂）。
                  <br/>春节回家，面对亲戚们的“灵魂拷问”，
                  <br/>你是选择委曲求全，还是重拳出击？
                  <br/>用抽象打败魔法，保卫你的精神状态！
                </p>
                <button 
                  onClick={handleStart}
                  className="retro-btn px-8 py-3 text-xl font-bold text-rose-600 flex items-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5" />
                  开始受刑 (Start)
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col gap-6"
            >
              {/* Status Bars */}
              <div className="retro-window p-1">
                 <div className="retro-title-bar">
                  <span>System_Status.sys</span>
                </div>
                <div className="p-4 flex flex-col gap-4 bg-rose-50">
                  <div>
                    <div className="flex justify-between mb-1 font-bold text-rose-800">
                      <span className="flex items-center gap-2"><Heart className="w-4 h-4" /> 我的精神状态</span>
                      <span>{mentalState}/100</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill blue" style={{ width: `${mentalState}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 font-bold text-rose-800">
                      <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> 亲戚的血压</span>
                      <span>{relativeBP}/200</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(relativeBP / 200) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Area */}
              <div className="retro-window p-1 relative">
                <div className="retro-title-bar">
                  <span>Question_{currentQIndex + 1}.exe</span>
                </div>
                <div className="p-6 bg-white min-h-[200px] flex flex-col justify-center">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-6xl">{questions[currentQIndex].avatar}</div>
                    <div>
                      <h3 className="font-bold text-rose-600 text-xl mb-2">
                        {questions[currentQIndex].relative}
                      </h3>
                      <p className="text-lg text-rose-900 leading-relaxed">
                        "{questions[currentQIndex].text}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    {questions[currentQIndex].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        disabled={showFeedback}
                        className="retro-btn p-4 text-left text-rose-800 font-medium hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {idx + 1}. {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Feedback Overlay */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/90 flex items-center justify-center z-10"
                    >
                      <div className="text-2xl font-bold text-rose-600 bg-rose-100 px-6 py-3 border-4 border-rose-500 shadow-[4px_4px_0px_#fda4af]">
                        {feedbackText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {gameState === 'end' && (
            <motion.div
              key="end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="retro-window p-1"
            >
              <div className="retro-title-bar">
                <span>Result.log</span>
                <div className="flex gap-2">
                  <X className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
              <div className="p-8 text-center flex flex-col items-center">
                {getEnding().icon}
                <h2 className="text-3xl font-bold mb-4 text-rose-600">达成结局：{getEnding().title}</h2>
                <p className="text-rose-800 mb-8 text-lg leading-relaxed max-w-md">
                  {getEnding().desc}
                </p>
                
                <div className="w-full bg-rose-50 p-4 border-2 border-rose-200 mb-8 text-left">
                  <h3 className="font-bold text-rose-800 mb-2">最终数据：</h3>
                  <p className="text-rose-700">精神状态: {mentalState}/100</p>
                  <p className="text-rose-700">亲戚血压: {relativeBP}/200</p>
                </div>

                <button 
                  onClick={handleStart}
                  className="retro-btn px-8 py-3 text-xl font-bold text-rose-600"
                >
                  再来一年 (Restart)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
