import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import { ROUTER_URL } from "@/router/route.const";

const pageVariants = {
  initialFromRight: {
    opacity: 0,
    x: "60%",
    scale: 0.95,
    filter: "blur(8px)",
  },
  initialFromLeft: {
    opacity: 0,
    x: "-60%",
    scale: 0.95,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exitToLeft: {
    opacity: 0,
    x: "-40%",
    scale: 0.95,
    filter: "blur(6px)",
  },
  exitToRight: {
    opacity: 0,
    x: "40%",
    scale: 0.95,
    filter: "blur(6px)",
  },
};

const pageTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 30,
  mass: 0.8,
};

const AuthAnimatedLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();

  const isLogin = location.pathname === ROUTER_URL.CLIENT_ROUTER.LOGIN;
  const isRegister = location.pathname === ROUTER_URL.CLIENT_ROUTER.REGISTER;

  // Login: image LEFT, form RIGHT → entering from right, exiting to right
  // Register: form LEFT, image RIGHT → entering from left, exiting to left
  const getInitial = () => {
    if (isLogin) return "initialFromRight";
    if (isRegister) return "initialFromLeft";
    return "initialFromRight";
  };

  const getExit = () => {
    if (isLogin) return "exitToRight";
    if (isRegister) return "exitToLeft";
    return "exitToRight";
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#faf7f2] dark:bg-stone-950">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial={getInitial()}
          animate="animate"
          exit={getExit()}
          transition={pageTransition}
          className="w-full min-h-screen"
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthAnimatedLayout;
