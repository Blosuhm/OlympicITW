$().ready(function () {
  let mySwiper = new Swiper(".swiper-container", {
    loop: true,
    slidesPerView: 3,
    autoplay: {
      delay: 5000,
    },
    speed: 5000,
  });
  mySwiper.on("touchEnd", function () {
    setTimeout(function () {
      mySwiper.autoplay.start();
    }, 10000);
  });
});
