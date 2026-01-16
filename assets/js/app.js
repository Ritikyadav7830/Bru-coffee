let btn = document.getElementById ('page1-lessgo');
console.log (btn);

btn.addEventListener ('click', () => {
  showScreen ('.page2');
});


// page 2
let page2Next = document.getElementById ('page2-next');

page2Next.addEventListener ('click', () => {
  showScreen ('.page3');
});


// page3 
let page3Next = document.getElementById ('page3-next');

page3Next.addEventListener ('click', () => {
  showScreen ('.page4');
});


let page3back = document.getElementById ('page3-back');

page3back.addEventListener ('click', () => {
  showScreen ('.page2');
});

// page4
let page4back = document.getElementById ('page4-back');

page4back.addEventListener ('click', () => {
  showScreen ('.page3');
});
const allScreen = document.querySelectorAll ('.common-section');
function showScreen (showScreen) {
  allScreen.forEach (screen => {
    if (!screen.classList.contains ('d-none')) {
      screen.classList.add ('d-none');
    }
  });

  document.querySelector (showScreen).classList.remove ('d-none');
}
