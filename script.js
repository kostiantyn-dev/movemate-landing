const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const calculator = document.querySelector("[data-calculator]");
const services = document.querySelector("[data-services]");
const faq = document.querySelector("[data-faq]");
const leadForm = document.querySelector("[data-lead-form]");

const money = (value) => `${Math.round(value).toLocaleString("uk-UA")} грн`;

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}

const scenarioData = {
  apartment: {
    kicker: "Сценарій: квартира",
    title: "Пакування, перенесення, транспорт і збірка меблів за один день",
    text: "Команда маркує коробки по кімнатах, захищає меблі, перевозить речі та розставляє головне на новому місці.",
    bullets: ["2-5 вантажників залежно від обсягу", "Плівка, коробки, стрейч і кутники", "Фотофіксація крихких предметів"]
  },
  office: {
    kicker: "Сценарій: офіс",
    title: "Переїзд робочих місць без простою команди",
    text: "Плануємо переїзд на вечір або вихідний, маркуємо техніку й робочі зони, а кабелі та документи пакуємо окремо.",
    bullets: ["План переїзду по відділах", "Окреме пакування техніки", "Розстановка робочих місць на новій локації"]
  },
  commerce: {
    kicker: "Сценарій: бізнес",
    title: "Перевезення шоуруму, складу або студії з контролем товару",
    text: "Рахуємо одиниці, пакуємо вітрини, стійки й товар, а координатор фіксує статус кожної зони.",
    bullets: ["Чек-лист товару і обладнання", "Захист вітрин, дзеркал і декору", "Можливість тимчасового складу"]
  }
};

document.querySelectorAll("[data-scenario]").forEach((button) => {
  button.addEventListener("click", () => {
    const current = scenarioData[button.dataset.scenario];
    const panel = document.querySelector("[data-scenario-panel]");

    document.querySelectorAll("[data-scenario]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    panel.innerHTML = `
      <p class="scenario-kicker">${current.kicker}</p>
      <h3>${current.title}</h3>
      <p>${current.text}</p>
      <ul>${current.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
    `;
  });
});

if (calculator) {
  const roomsInput = calculator.elements.rooms;
  const distanceInput = calculator.elements.distance;
  const roomsLabel = calculator.querySelector("[data-rooms-label]");
  const distanceLabel = calculator.querySelector("[data-distance-label]");
  const total = calculator.querySelector("[data-total]");
  const team = calculator.querySelector("[data-team]");
  const heroPrice = document.querySelector("[data-hero-price]");
  const heroDetails = document.querySelector("[data-hero-details]");

  const cityMultiplier = {
    kyiv: 1.12,
    lviv: 1.04,
    dnipro: 1,
    odesa: 1.06
  };

  const typeMultiplier = {
    apartment: 1,
    office: 1.22,
    commerce: 1.32
  };

  const updateCalc = () => {
    const rooms = Number(roomsInput.value);
    const distance = Number(distanceInput.value);
    const floor = Number(calculator.elements.floor.value || 1);
    const boxes = Number(calculator.elements.boxes.value || 5);
    const hasElevator = calculator.elements.elevator.checked;
    const packing = calculator.elements.packing.checked;
    const assembly = calculator.elements.assembly.checked;
    const urgent = calculator.elements.urgent.checked;
    const city = calculator.elements.city.value;
    const type = calculator.elements.type.value;

    let price = 2600;
    price += rooms * 1150;
    price += distance * 62;
    price += boxes * 28;
    price += hasElevator ? 0 : Math.max(0, floor - 1) * 180;
    price += packing ? rooms * 620 + boxes * 18 : 0;
    price += assembly ? rooms * 460 : 0;
    price *= cityMultiplier[city] * typeMultiplier[type];
    price *= urgent ? 1.18 : 1;

    const people = Math.min(6, Math.max(2, Math.ceil((rooms + boxes / 24) / 1.4)));
    const cars = rooms > 3 || boxes > 55 || type !== "apartment" ? 2 : 1;
    const hours = Math.max(3, Math.ceil(rooms * 1.5 + distance / 18 + boxes / 30));

    roomsLabel.textContent = rooms;
    distanceLabel.textContent = `${distance} км`;
    total.textContent = money(price);
    team.textContent = `Команда: ${people} людини, ${cars} авто, ${hours}-${hours + 1} годин`;
    heroPrice.textContent = `від ${money(price)}`;
    heroDetails.textContent = `${rooms}-кімнатний сценарій, ${packing ? "пакування командою" : "без пакування"}`;
  };

  calculator.addEventListener("input", updateCalc);
  updateCalc();
}

if (services) {
  const list = document.querySelector("[data-package-list]");
  const packageTotal = document.querySelector("[data-package-total]");
  const packageName = document.querySelector("[data-package-name]");

  const updatePackage = () => {
    const selected = [...services.querySelectorAll(".service-option.is-selected")];
    const names = selected.map((item) => item.dataset.service);
    const total = selected.reduce((sum, item) => sum + Number(item.dataset.price), 0);

    list.innerHTML = names.map((name) => `<li>${name}</li>`).join("");
    packageTotal.textContent = money(total);
    packageName.textContent = selected.length >= 5 ? "Move Premium" : selected.length >= 3 ? "Move Plus" : "Move Start";
  };

  services.querySelectorAll(".service-option").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-selected");
      updatePackage();
    });
  });

  updatePackage();
}

if (faq) {
  faq.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".faq-item").classList.toggle("is-open");
    });
  });
}

if (leadForm) {
  const phoneInput = leadForm.elements.phone;
  const status = leadForm.querySelector("[data-form-status]");

  phoneInput.addEventListener("input", () => {
    const digits = phoneInput.value.replace(/\D/g, "").slice(0, 12);
    const normalized = digits.startsWith("380") ? digits : `380${digits.replace(/^0/, "")}`;
    const parts = [
      normalized.slice(0, 3),
      normalized.slice(3, 5),
      normalized.slice(5, 8),
      normalized.slice(8, 10),
      normalized.slice(10, 12)
    ].filter(Boolean);

    phoneInput.value = `+${parts.join(" ")}`;
  });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = leadForm.elements.name.value.trim();
    const phoneDigits = phoneInput.value.replace(/\D/g, "");

    status.className = "form-status";

    if (name.length < 2 || phoneDigits.length < 12) {
      status.textContent = "Перевірте ім'я та номер телефону.";
      status.classList.add("is-error");
      return;
    }

    status.textContent = "Готово. У реальному проєкті заявка пішла б менеджеру або в CRM.";
    status.classList.add("is-success");
    leadForm.reset();
  });
}
