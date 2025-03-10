import {motion} from 'motion/react';
import {useAtom} from 'jotai';
import {tabAtom} from '@/atoms/CommonAtom';

let tabs = [
  {id: 'sms', label: '문자 발송'},
  {id: 'alimtalk', label: '알림톡 발송'},
];

export default function Tabs() {
  let [activeTab, setActiveTab] = useAtom(tabAtom);

  return (
    <div className="flex space-x-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${
            activeTab === tab.id
              ? 'text-black'
              : 'text-white hover:text-white/60'
          } relative rounded-full px-3 py-1.5 text-sm font-medium cursor-pointer outline-sky-400 transition focus-visible:outline-2`}
          style={{
            WebkitTapHighlightColor: 'transparent',
            mixBlendMode: 'exclusion',
          }}>
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 z-10 bg-[#BABE00] mix-blend-overlay"
              style={{borderRadius: 16}}
              transition={{type: 'spring', bounce: 0.2, duration: 0.6}}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
