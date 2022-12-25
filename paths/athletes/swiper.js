$().ready(function () {
  let mySwiper = new Swiper(".swiper-container", {
    slidesPerView: 3,
    autoplay: {
      delay: 0,
    },
    speed: 2000,
    effect: "coverflow",
    coverflowEffect: { rotate: 30, slideShow: false },
  });
});
