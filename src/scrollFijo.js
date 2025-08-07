// let lastScroll = 0;
// let isScrolling = false;
// let touchStartY = 0;
// const SCROLL_STEP = 200;
// const SCROLL_DELAY = 0;

// const getMaxScroll = () =>
//   document.documentElement.scrollHeight - window.innerHeight;

// const scrollToStep = (direction) => {
//   if (isScrolling) return;
//   isScrolling = true;

//   // Sincroniza con el scroll real actual
//   lastScroll = window.scrollY;

//   lastScroll += direction * SCROLL_STEP;
//   lastScroll = Math.max(0, Math.min(lastScroll, getMaxScroll()));

//   window.scrollTo({
//     top: lastScroll,
//     behavior: "smooth",
//   });

//   setTimeout(() => {
//     isScrolling = false;
//   }, SCROLL_DELAY);
// };

// const setupScrollSteps = () => {
//   // Scroll con mouse/trackpad
//   window.addEventListener(
//     "wheel",
//     (e) => {
//       console.log("Evento wheel detectado"); // Debug
//       if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

//       e.preventDefault();
//       const direction = e.deltaY > 0 ? 1 : -1;
//       scrollToStep(direction);
//     },
//     { passive: false }
//   );

//   // Scroll en mobile con dedo
//   window.addEventListener(
//     "touchstart",
//     (e) => {
//       if (e.touches.length > 1) return;
//       touchStartY = e.touches[0].clientY;
//     },
//     { passive: false }
//   );

//   window.addEventListener(
//     "touchend",
//     (e) => {
//       if (e.changedTouches.length > 1) return;

//       const touchEndY = e.changedTouches[0].clientY;
//       const deltaY = touchStartY - touchEndY;
//       const direction = deltaY > 0 ? 1 : -1;

//       if (Math.abs(deltaY) > 30) {
//         console.log("Evento touch detectado"); // Debug
//         scrollToStep(direction);
//       }
//     },
//     { passive: false }
//   );
// };

// export default setupScrollSteps;
