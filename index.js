
// countdown
const timer_date = new Date(2024, 5, 21);
const container = document.querySelector('.countdown__text');
function countdownTimer() {
const diff = timer_date - new Date();
if (diff <= 0) {
  clearInterval(timer_countdown);
}
const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
const minutes = Math.floor(diff / 1000 / 60) % 60;
container.textContent = days + ' days ' + hours + ' hours ' + minutes + ' minutes '
}
const timer_countdown = setInterval(countdownTimer, 1000)


// fixed menu
const header = document.querySelector('.header')
const menu = document.querySelector('.menu')
document.addEventListener('scroll', function() {
  if (window.pageYOffset >= header.offsetHeight + menu.offsetHeight) {
    menu.classList.add('fixed_menu')
  }
  else {
    menu.classList.remove('fixed_menu')
  }
});


// feedback form
let form_active = false;
const form_button = document.querySelector(".submit_button");
let form = document.querySelector('.form-popup-container')
const form_text = document.querySelector('.footer__form')
form_text.addEventListener('click', function() {
  form.classList.add('active')
  form.classList.remove('inactive')

  if (!form_button.classList.contains("button-loading")) {
    form_button.value = "Отправить";
    form_button.classList.remove("button-success");
    form_button.classList.remove("button-failure");
    form_button.disabled = false;
  }
  form.classList.remove('inactive');
  form.classList.add('active');
  form.style.transform = "scale(1.0)";
  form_active = true;
  ++popups_active;
  background.classList.add('active')
  background.classList.remove("inactive");
})

form_button.addEventListener('click', () => {
    const form_tel = document.querySelector(".form__input[type=tel]");
  const form_email = document.querySelector(".form__input[type=email]");
  const form_feedback = document.querySelector(".form__input[id=feedback]");

  let tel_data = form_tel.value;
  let email_data = form_email.value;
  let feedback_data = form_feedback.value;
  if (!(/^(\+7|8)\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(tel_data)
      || /^(\+7|8)[0-9]{10}$/.test(tel_data) || tel_data.length === 0)) {
    Warning("номер введен неправильно");
    return;
  } else if (!(/^[a-zA-Z0-9\-.]*@[a-zA-Z0-9\-.]*.[a-zA-Z]*$/.test(email_data) || email_data.length === 0)) {
    Warning("адрес электронный почты введен неправильно");
    return;
  } else if (!(/^[а-яА-Я0-9.,?!:;\- ]*$/.test(feedback_data) || feedback_data.length === 0)) {
    Warning("сообщение нужно написать на русском (со знаками препинания)");
    return;
  }

  if (tel_data.length === 0 && feedback_data.length === 0 && email_data.length === 0) {
    Warning("надо бы что-то ввести..")
    return;
  }

  form_button.value = "отправляем";
  form_button.classList.add("button-loading");
  form_button.disabled = true;
  document.body.style.cursor = 'wait';

  (new Promise(resolve => setTimeout(resolve, 1000))).then(
      () => sendData("").then((response) => {
        if (response.ok) {
          form_button.value = "отправлено";
          form_button.classList.remove("button-loading");
          warning_container.textContent = ''
          form_button.classList.add("button-success");
          document.body.style.cursor = 'default';
          form_tel.value = "";
          form_email.value = "";
          form_feedback.value = "";
        } else {
          form_button.value = "ошибка";
          form_button.classList.remove("button-loading");
          form_button.classList.add("button-failure");
          document.body.style.cursor = 'default';
        }
      }).catch(() => {
        form_button.value = "ошибка";
        form_button.classList.remove("button-loading");
        form_button.classList.add("button-failure");
        document.body.style.cursor = 'default';
      })
  );
});

let popups_active = 0;
function closeForm() {
  form.style.transform = "scale(0.0)"
  form_active = false;
    form.classList.remove('active');
    form.classList.add('inactive');
    --popups_active;
    warning_container.textContent = ''
    background.classList.remove('active')
    background.classList.add("inactive");
}

let warning_container = document.querySelector('.warning')
function Warning(text) {
  warning_container.textContent = text;
}

async function sendData(data) {
  return await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data
  });
}


// Timed popup

const timed = document.querySelector(".timed-popup-container");
let timed_active = false;

function ShowTimed() {
  if (popups_active) {
    return;
  }
  timed.classList.add("active");
  timed.classList.remove("inactive");
  timed.style.transform = "scale(1.0)";
  timed_active = true;
  ++popups_active;
  background.classList.add('active')
    background.classList.remove("inactive");

}

function closeTimed() {
  if (!timed_active) {
    return;
  }
  timed.style.transform = "scale(0.0)"
  timed_active = false;
  setTimeout(function () {
    timed.classList.add('inactive');
    timed.classList.remove('active');
    --popups_active;
    background.classList.remove('active')
    background.classList.add("inactive");
  }, 200); // the same amount of time the transition takes
}

let wasShown = false;
function timedPopup() {
  if (wasShown === true) {
    return;
  }
  setTimeout(() => {
    ShowTimed();
    wasShown = true
  }, 30000); // 30s
}
timedPopup();

// popup background

const background = document.querySelector(".background");

// popup controls

document.addEventListener('click', function (event) {
  if (event.target === form) {
    closeForm();
  }
  if (event.target === timed) {
    closeTimed();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    if (timed_active) {
      closeTimed();
    } else if (form_active) {
      closeForm();
    }
    if (gallery_active) {
      closeGallery();
    }
  }
});


let gallery = document.querySelector(".gallery_popup");
let images = document.querySelectorAll(".gallery__image");
let image_counter = 0;
let right_arrow = document.querySelector(".gallery__arrow_right");
let left_arrow = document.querySelector(".gallery__arrow_left");
let gallery_active = false
let photos = document.querySelectorAll(".gallery__content")


document.querySelectorAll('.gallery__image').forEach(card => card.addEventListener('click', function() {
  image_counter = Number(this.id);
  let s = parseInt(images[image_counter].getAttribute('id'));
  photos[s + 1].classList.add("active")
  photos[s + 1].classList.remove("inactive")
  background.classList.remove('inactive')
  background.classList.add('active')
      gallery.classList.remove('inactive')
  gallery.classList.add('active')
  document.querySelector('.close').classList.add('active')
    document.querySelector('.close').classList.remove('inactive')
  left_arrow.setAttribute('style', 'opacity: 100');
  right_arrow.setAttribute('style', 'opacity: 100');
  if (image_counter === 0) {
    left_arrow.setAttribute('style', 'opacity: 0');
  }
  if (image_counter === images.length - 1) {
    right_arrow.setAttribute('style', 'opacity: 0');
  }
  gallery_active = true
  ++popups_active;
}));


// scroll
function rightScroll()  {
    if (image_counter + 1 < images.length) {

      photos[image_counter + 1].classList.add('inactive')
    photos[image_counter + 1].classList.remove('active')
    image_counter += 1;
  let s = parseInt(images[image_counter].getAttribute('id'));
    photos[s + 1].classList.add("active")
    photos[s + 1].classList.remove("inactive")

    left_arrow.setAttribute('style', 'opacity: 100');
    if (image_counter === images.length - 1) {
      right_arrow.setAttribute('style', 'opacity: 0');
    }
  }
}

function leftScroll() {
  if (image_counter > 0) {
    photos[image_counter + 1].classList.add('inactive')
    photos[image_counter + 1].classList.remove('active')
    image_counter -= 1;
  let s = parseInt(images[image_counter].getAttribute('id'));
    photos[s + 1].classList.add("active")
  photos[s + 1].classList.remove("inactive")
  right_arrow.setAttribute('style', 'opacity: 100');
  if (image_counter === 0) {
    left_arrow.setAttribute('style', 'opacity: 0');
  }
  }
}

right_arrow.addEventListener('click', () => rightScroll());
left_arrow.addEventListener('click', () => leftScroll());
document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' && gallery_active) leftScroll();
  if (event.key === 'ArrowRight' && gallery_active) rightScroll()
  });
// scroll

let exit = document.querySelector('.gallery-exit')
exit.addEventListener('click', () => closeGallery())
function closeGallery() {
  background.classList.add('inactive')
  background.classList.remove('active')
      gallery.classList.add('inactive')
  gallery.classList.remove('active')
    document.querySelector('.close').classList.add('inctive')
    document.querySelector('.close').classList.remove('active')
  gallery_active = false
  for (let i = 1; i < photos.length; i++) {
  photos[i].classList.add("inactive")
  photos[i].classList.remove("active")
}
  --popups_active
}
