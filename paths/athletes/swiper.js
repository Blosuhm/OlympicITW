$().ready(function () {
  let mySwiper = new Swiper(".swiper-container", {
    loop: true,
    freemode: true,
    slidesPerView: 3,
    autoplay: {
      delay: 5000,
    },
    speed: 5000,
    effect: "cards",
    cardEffect: {
      slideShadows: false,
    },
  });
  mySwiper.on("touchEnd", function () {
    setTimeout(function () {
      mySwiper.autoplay.start();
    }, 10000);
  });
});
