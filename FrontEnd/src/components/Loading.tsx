import { motion } from 'framer-motion';

interface LoadingProps {
  fullScreen?: boolean;
}

export const Loading = ({ fullScreen = true }: LoadingProps) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const logoVariants = {
    initial: { 
      scale: 0.5,
      opacity: 0,
    },
    animate: { 
      scale: [0.8, 1.3, 1, 1.3, 0.8],
      opacity: 1,
      transition: {
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.5
        }
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 0.4, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };



  const containerClass = fullScreen 
    ? "fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0f]"
    : "flex items-center justify-center py-12";

  return (
    <motion.div
      className={containerClass}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Static glow effect under the logo */}
        <div
          className="absolute w-24 h-24 bg-purple-500 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(20px)',
            opacity: 0.4,
            zIndex: 0,
          }}
        />

        {/* Logo container - centered with zoom in/out animation */}
        <motion.div
          className="absolute z-10"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.img
            src="/LOGO.png"
            alt="EventCraft Logo"
            className="w-20 h-20 object-contain"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.6))',
            }}
          />
        </motion.div>

        {/* Sprinkles that blink around the logo */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const radius = 50;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                background: i % 3 === 0 
                  ? '#a78bfa' 
                  : i % 3 === 1 
                    ? '#8b5cf6' 
                    : '#c4b5fd',
                boxShadow: `0 0 8px ${i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#8b5cf6' : '#c4b5fd'}`,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: [0, x, 0],
                y: [0, y, 0],
                opacity: [0, 1, 0.3, 1, 0],
                scale: [0, 1, 1.2, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

