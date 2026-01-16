let btn = document.getElementById ('page1-lessgo');

btn.addEventListener ('click', () => {
  showScreen ('.page2');
});

const page2Next = document.getElementById ('page2-next');
const yourNameInput = document.querySelector ('.your-name');
const boosNameInput = document.querySelector ('.boo-name');
const checkbox = document.getElementById ('checkbox');

const bothNameHiddenDiv = document.querySelector ('.bothName-hidden-div');
const checkedHiddenDiv = document.querySelector ('.checked-hidden-div');
const photoHiddenDiv = document.querySelector ('.photo-hidden-div');

const file1Input = document.getElementById ('fileInput');
const file2Input = document.getElementById ('fileInput2');
const uploadImg1 = document.querySelector (
  '#uploadContainer .upload-img-1 img'
);
const uploadImg2 = document.querySelector (
  '#uploadContainer2 .upload-img-2 img'
);

let photo1Uploaded = false;
let photo2Uploaded = false;

[yourNameInput, boosNameInput].forEach (input => {
  input.addEventListener ('input', () => {
    if (yourNameInput.value !== '' && boosNameInput.value !== '') {
      bothNameHiddenDiv.style.display = 'none';
    }
  });
});

checkbox.addEventListener ('change', () => {
  if (checkbox.checked) {
    checkedHiddenDiv.style.display = 'none';
  }
});

// File input 1
file1Input.addEventListener ('change', e => {
  const file = e.target.files[0];
  if (file) {
    uploadImg1.src = URL.createObjectURL (file);
    uploadImg1.classList.add ('full-width');
    photo1Uploaded = true;

    if (photo1Uploaded && photo2Uploaded) {
      photoHiddenDiv.classList.add ('d-none');
    }
  }
});

// File input 2
file2Input.addEventListener ('change', e => {
  const file = e.target.files[0];
  if (file) {
    uploadImg2.src = URL.createObjectURL (file);
    uploadImg2.classList.add ('full-width');
    photo2Uploaded = true;

    if (photo1Uploaded && photo2Uploaded) {
      photoHiddenDiv.classList.add ('d-none');
    }
  }
});

page2Next.addEventListener ('click', e => {
  e.preventDefault ();

  if (yourNameInput.value === '' || boosNameInput.value === '') {
    bothNameHiddenDiv.style.display = 'block';
    bothNameHiddenDiv.style.color = 'red';
    return;
  }

  if (!checkbox.checked) {
    checkedHiddenDiv.style.display = 'block';
    checkedHiddenDiv.style.color = 'red';
    return;
  }

  if (!photo1Uploaded || !photo2Uploaded) {
    photoHiddenDiv.classList.remove ('d-none');
    photoHiddenDiv.style.color = 'red';
    return;
  }

  showScreen ('.page3');
});

// page 4 pr jane ke liye
const page3Next = document.getElementById ('page3-next');
const customSelectTrigger = document.querySelector ('.custom-select-trigger');
const customOptions = document.querySelectorAll ('.custom-option');
const notSelectDiv = document.querySelector ('.Not-select-option');

let selectedValue = '';

customOptions.forEach (option => {
  option.addEventListener ('click', () => {
    selectedValue = option.dataset.value;
    customSelectTrigger.textContent = option.textContent;

    notSelectDiv.classList.add ('d-none');
  });
});

page3Next.addEventListener ('click', () => {
  if (selectedValue === '') {
    notSelectDiv.classList.remove ('d-none');
    notSelectDiv.style.color = 'red';
    notSelectDiv.style.textAlign = 'center';
    notSelectDiv.style.marginTop = '20px';
    notSelectDiv.style.fontSize = '1rem';
    return;
  }

  showScreen ('.page4');
});

// page 2pr return hone pr
let page3back = document.getElementById ('page3-back');

page3back.addEventListener ('click', () => {
  showScreen ('.page2');
});

// page4
let page4back = document.getElementById ('page4-back');

page4back.addEventListener ('click', () => {
  showScreen ('.page3');
});

// PAGE 4: GENERATE BUTTON LOGIC (random success/failure + final page image)

const page4Generate = document.getElementById ('page4-generate');
const page4Content = document.getElementById ('page4-content');

const customSelectTrigger2 = document.getElementById (
  'custom-select-trigger-2'
);
const customOptions2 = document.querySelectorAll ('.custom-options-2');
const notSelectDiv2 = document.querySelector ('.Not-select-option2');

let selectedValue2 = '';

customOptions2.forEach (option => {
  option.addEventListener ('click', () => {
    selectedValue2 = option.dataset.value;
    customSelectTrigger2.textContent = option.textContent;
    notSelectDiv2.classList.add ('d-none');
  });
});

page4Generate.addEventListener ('click', () => {
  const page4back = document.getElementById ('page4-back');
  const loadingSection = document.getElementById ('loading-section');
  const loadingBar = document.querySelector ('.loading-progress');
  const loadingBar2 = document.querySelector ('.loading-bar');
  const loadingText = document.getElementById ('loading-text');

  if (selectedValue2 === '') {
    notSelectDiv2.classList.remove ('d-none');
    notSelectDiv2.style.color = 'red';
    notSelectDiv2.style.textAlign = 'center';
    notSelectDiv2.style.marginTop = '20px';
    return;
  }

  // Start loading
  loadingText.innerHTML = '';
  loadingSection.classList.remove ('d-none');
  loadingBar.style.width = '0%';

  page4Generate.style.display = 'none';
  page4back.style.display = 'none';
  page4Content.querySelector ('h3').classList.add ('d-none');
  page4Content
    .querySelector ('.custom-select-wrapper')
    .classList.add ('d-none');
  page4Content.querySelector ('.page3-btn').classList.add ('d-none');

  let progress = 0;
  let i = 0;
  const textSteps = [
    'Preparing your magical brew...',
    'Stirring up the vibes...',
    'Adding a pinch of love...',
    'Almost there...',
  ];

  const interval = setInterval (() => {
    progress += 25;
    loadingBar.style.width = `${progress}%`;
    if (i < textSteps.length) {
      loadingText.innerHTML = textSteps[i];
      i++;
    }

    if (progress >= 100) {
      clearInterval (interval);

      setTimeout (() => {
        const isSuccess = Math.random () > 0.4;

        loadingBar2.style.display = 'none';

        if (isSuccess) {
          const finalImages = [
            'assets/image/final-page/couple1.png',
            'assets/image/final-page/couple2.jpeg',
            'assets/image/final-page/couple3.jpg',
            'assets/image/final-page/couple4.jpg',
            'assets/image/final-page/couple5.jpeg',
          ];
          const randomIndex = Math.floor (Math.random () * finalImages.length);
          const selectedImage = finalImages[randomIndex];

          const finalImgElement = document.querySelector (
            '.final-page .final-image img'
          );
          finalImgElement.src = selectedImage;

          showScreen ('.final-page');
        } else {
          loadingText.innerHTML = `
            <h3>Remind & surprise your boo!</h3>
            <p>Do tag us @brucoffeein and we shall make that dream date happen for real</p>
            <p class="error-text" style="color:red;">Failed to generate image after multiple attempts. Please try again.</p>
            <button id="restart-btn">Restart</button>
          `;
        }

        const restartBtn = document.getElementById ('restart-btn');
        if (restartBtn) {
          restartBtn.addEventListener ('click', () => {
            location.reload ();
          });
        }
      }, 1500);
    }
  }, 2500);
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

// custom select option ke liye js

const customSelect = document.querySelector ('.custom-select');
const trigger = customSelect.querySelector ('.custom-select-trigger');
const options = customSelect.querySelectorAll ('.custom-option');

trigger.addEventListener ('click', () => {
  customSelect.classList.toggle ('open');
});

options.forEach (option => {
  option.addEventListener ('click', () => {
    trigger.textContent = option.textContent;
    customSelect.classList.remove ('open');
  });
});

// Click outside to close
document.addEventListener ('click', e => {
  if (!customSelect.contains (e.target)) {
    customSelect.classList.remove ('open');
  }
});

document.addEventListener ('DOMContentLoaded', () => {
  const customSelect2 = document.getElementById ('custom-select-2');
  const trigger2 = document.getElementById ('custom-select-trigger-2');
  const options2 = customSelect2.querySelectorAll ('.custom-option');

  trigger2.addEventListener ('click', e => {
    customSelect2.classList.toggle ('open');
    e.stopPropagation ();
  });

  options2.forEach (option => {
    option.addEventListener ('click', () => {
      trigger2.textContent = option.textContent;
      customSelect2.classList.remove ('open');
    });
  });

  document.addEventListener ('click', () => {
    customSelect2.classList.remove ('open');
  });
});

// picture upload
const uploadContainer = document.getElementById ('uploadContainer');
const uploadImage1 = document.querySelector ('.upload-img-1');
const uploadImage2 = document.querySelector ('.upload-img-2');
const fileInput = document.getElementById ('fileInput');

uploadContainer.addEventListener ('click', () => {
  fileInput.click ();
});

fileInput.addEventListener ('change', event => {
  const file = event.target.files[0];
  if (file) {
    const img = uploadContainer.querySelector ('.upload-img-1 img');
    img.src = URL.createObjectURL (file);

    uploadImage1.style.width = '100%';
    uploadImage1.style.marginTop = '0';
    uploadImage1.style.transition = 'all 0.2s ease';
    document.getElementById ('pera-pic').style.display = 'none';
    document.getElementById ('pera2').style.display = 'none';
    document.getElementById ('pera3').style.display = 'none';
  }
});

const uploadContainer2 = document.getElementById ('uploadContainer2');
const fileInput2 = document.getElementById ('fileInput2');

uploadContainer2.addEventListener ('click', () => {
  fileInput2.click ();
});

fileInput2.addEventListener ('change', event => {
  const file = event.target.files[0];
  if (file) {
    console.log ('Selected file:', file.name);

    const img2 = uploadContainer2.querySelector ('.up-img-2');
    img2.src = URL.createObjectURL (file);

    uploadImage2.style.width = '100%';
    uploadImage2.style.marginTop = '0';
    uploadImage2.style.transition = 'all 0.2s ease';
    document.getElementById ('pera-pic-2').style.display = 'none';
    document.getElementById ('pera4').style.display = 'none';
    document.getElementById ('pera5').style.display = 'none';
  }
});

let finalPageRestart = document.getElementById ('final-page-restart');

finalPageRestart.addEventListener ('click', () => {
  location.reload ();
});

const finalPageDownload = document.getElementById ('final-page-download');

finalPageDownload.addEventListener ('click', () => {
  const finalImg = document.querySelector ('.final-image img');

  const link = document.createElement ('a');
  link.href = finalImg.src;
  link.download = 'bru_final_image.png';
  document.body.appendChild (link);
  link.click ();
  document.body.removeChild (link);
});
