// Переключение темы
let lightThemeButton = document.querySelector('.js-button-sun');
let darkThemeButton = document.querySelector('.js-button-moon');

lightThemeButton.addEventListener('click', () => {
    lightThemeButton.classList.add('theme__button--active');
    darkThemeButton.classList.remove('theme__button--active');
    document.body.classList.remove('dark');
});

darkThemeButton.addEventListener('click', () => {
    darkThemeButton.classList.add('theme__button--active');
    lightThemeButton.classList.remove('theme__button--active');
    document.body.classList.add('dark');
});

// Меню
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('menu-button--active');
    navbar.classList.toggle('navbar--active');
}

// Прокрутка
(function () {
    let DEBOUNCE_INTERVAL = 100; // ms
    let lastTimeout = null;

    window.debounce = function (fun) {
        if (lastTimeout) {
            window.clearTimeout(lastTimeout);
        }

        lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
    }
})();

let body = document.body;
let sections = document.querySelectorAll('section');
let header = document.querySelector('.header');
let nav = header.querySelector('nav');

// body.scrollHeight // полная высота body
// window.scrollY // насколько прокручен документ
// window.innerHeight // высота viewport

function scrolling() {
    let currentSectionName = null;
    let percentSection = 0;
    let headerHight = header.offsetHeight;

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionId = section.getAttribute('id');
        let sectionRect = section.getBoundingClientRect();
        let visibleHeight;
        let percent;

        // Проверка на видимость раздела
        let visibleOn = false;
        if (sectionRect.top < 0 + headerHight) {
            if ((sectionRect.top + sectionRect.height) > 0 + headerHight) {
                visibleOn = true;
            }
        } else {
            visibleOn = sectionRect.top <= window.innerHeight;
        }

        if (visibleOn) {
            if (window.scrollY == 0) {
                currentSectionName = sectionId;
                break;
            }

            if (window.scrollY + window.innerHeight == body.scrollHeight) {
                currentSectionName = sections[sections.length - 1].getAttribute('id');
                break;
            }

            if (sectionRect.top < 0) {
                visibleHeight = sectionRect.top + sectionRect.height - headerHight;

                if (visibleHeight <= (window.innerHeight - headerHight)) {
                    percent = visibleHeight * 100 / (window.innerHeight - headerHight);
                } else {
                    percent = 100;
                }
            } else {
                if (sectionRect.top < headerHight) {
                    if (sectionRect.top + sectionRect.height - (headerHight - sectionRect.top) <= window.innerHeight) {
                        visibleHeight = sectionRect.height - (headerHight - sectionRect.top);
                    } else {
                        visibleHeight = window.innerHeight - headerHight;
                    }
                } else {
                    if (sectionRect.top + sectionRect.height - headerHight <= (window.innerHeight - headerHight)) {
                        visibleHeight = sectionRect.height;
                    } else {
                        visibleHeight = (window.innerHeight - headerHight) - (sectionRect.top - headerHight);
                    }
                }

                percent = visibleHeight * 100 / (window.innerHeight - headerHight);
            }

            if (percentSection <= percent) {
                currentSectionName = sectionId;
                percentSection = percent;
            }
        }
    }

    let activeLink = nav.querySelector('a.navbar__link--active');
    if (activeLink.getAttribute('href').substring(1) !== currentSectionName) {
        activeLink.classList.remove('navbar__link--active');
        nav.querySelector('a[href*=' + currentSectionName + ']').classList.add('navbar__link--active');
    }
}

window.onscroll = () => {
    window.debounce(scrolling);
}


const menuLinks = nav.querySelectorAll('.navbar__link');
if (menuLinks.length >= 1) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener('click', onMenuLinkClick);
    });

    function onMenuLinkClick(evt) {
        evt.preventDefault();

        let href = this.getAttribute('href').substring(1);

        const scrollTarget = document.getElementById(href);

        if (menuIcon && menuIcon.classList.contains('menu-button--active')) {
            menuIcon.classList.toggle('menu-button--active');
            navbar.classList.toggle('navbar--active');
        }

        window.scrollBy({
            top: scrollTarget.getBoundingClientRect().top - header.offsetHeight,
            behavior: 'smooth'
        });
    }
}