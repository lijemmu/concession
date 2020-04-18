$(".test").click(function(){
    alert("here")
})



const flightPath = {
  curviness: 1.25,
  autoRotate: true,
  values:[
      { x: 100, y: -20 }, { x: 300, y:10 }
  ]
};

const tween = new TimelineLite();

tween.add(
  TweenLite.to(".paper-plane", 1, {
      bezier: flightPath,
      ease: Power1.easeInOut
  })
);