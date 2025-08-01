const ramos = [
  // [id, nombre, semestre, requisitos]
  [1, "Introducción a la salud comunitaria", 1, []],
  [2, "Biología Celular", 1, []],
  [3, "Introducción a la matemática aplicada", 1, []],
  [4, "Introducción a la matroneria", 1, []],
  [5, "Morfología y función I", 1, []],
  [6, "Salud de la mujer, sexualidad y género", 1, []],

  [7, "Comunicación en salud comunitaria", 2, [1]],
  [8, "Química", 2, []],
  [9, "Inglés I", 2, []],
  [10, "Embriología Humana", 2, [2]],
  [11, "Morfología y función en matroneria", 2, [5]],
  [12, "Fundamentos de enfermería en ginecoobstetricia", 2, [4]],

  [13, "Ética en salud comunitaria", 3, [1]],
  [14, "Bioquímica", 3, [8]],
  [15, "Inglés II", 3, [9]],
  [16, "Bioestadistica", 3, [3]],
  [17, "Fisiología general", 3, [5]],
  [18, "Fundamentos en enfermería medicoquirúrgica", 3, [12]],

  [19, "Promoción de salud en comunidad", 4, [13]],
  [20, "Microbiología y parasitología en matroneria", 4, [14]],
  [21, "Obstetricia fisiológica", 4, [10, 17]],
  [22, "Ginecología fisiológica", 4, [17]],
  [23, "Fisiopatología", 4, [17]],
  [24, "Farmacología general", 4, [14]],

  [25, "Neonatología Fisiología", 5, [21]],
  [26, "Farmacología ginecoobstetrica", 5, [24]],
  [27, "Obstetricia patológica", 5, [21]],
  [28, "Ginecología patológica", 5, [22]],
  [29, "Salud pública y salud comunitaria", 5, [19]],
  [30, "Práctica integrada I", 5, [21, 22, 23]],

  [31, "Manejo clínico en ginecoobstétrica", 6, [27]],
  [32, "Recien nacido patológico", 6, [25]],
  [33, "Ginecología infanto juvenil", 6, [28]],
  [34, "Práctica integrada II", 6, [30]],

  [35, "Metodología de la investigación", 7, [16]],
  [36, "Climaterio y oncología en ginecología", 7, [28]],
  [37, "Cuidados del recién nacido patológico", 7, [32]],
  [38, "Educación para la salud", 7, [19]],
  [39, "Gestión y emprendimiento en salud", 7, [29]],
  [40, "Práctica integrada III", 7, [34]],

  [41, "Proyectos en salud comunitaria", 8, [35]],
  [42, "Seminario de grado", 8, [35]],
  [43, "Infertilidad humana", 8, [28]],
  [44, "Empleabilidad, mercado laboral y emprendimiento en matroneria", 8, [39]],
  [45, "Salud familiar", 8, [29]],
  [46, "Práctica integrada IV", 8, [40]],

  [47, "Implementación de proyectos en salud comunitaria", 9, [41]],
  [48, "Internado profesional I", 9, [46]],

  [49, "Preparación de examen de título", 10, [42]],
  [50, "Internado profesional II", 10, [48]]
];

const aprobados = JSON.parse(localStorage.getItem("aprobados")) || [];

const container = document.getElementById("malla-container");
const mensaje = document.getElementById("mensaje");

// Agrupar ramos por semestre
const semestres = {};
ramos.forEach(([id, nombre, semestre, req]) => {
  if (!semestres[semestre]) semestres[semestre] = [];
  semestres[semestre].push({ id, nombre, requisitos: req });
});

// Crear columnas por semestre
Object.entries(semestres).forEach(([semestre, ramosSem]) => {
  const col = document.createElement("div");
  col.className = "semestre";
  col.innerHTML = `<h3>Semestre ${semestre}</h3>`;

  ramosSem.forEach(ramo => {
    const div = document.createElement("div");
    div.className = "ramo";
    div.dataset.id = ramo.id;
    div.textContent = ramo.nombre;

    updateRamoStyle(div, ramo.id, ramo.requisitos);

    div.addEventListener("click", () => handleClick(ramo, div));
    col.appendChild(div);
  });

  container.appendChild(col);
});

function handleClick(ramo, div) {
  const pendientes = ramo.requisitos.filter(req => !aprobados.includes(req));
  if (pendientes.length > 0) {
    const nombres = pendientes.map(id => ramos.find(r => r[0] === id)[1]);
    mostrarMensaje(`Requiere aprobar: ${nombres.join(", ")}`);
    return;
  }

  const index = aprobados.indexOf(ramo.id);
  if (index === -1) {
    aprobados.push(ramo.id);
  } else {
    aprobados.splice(index, 1);
  }

  localStorage.setItem("aprobados", JSON.stringify(aprobados));
  actualizarTodo();
}

function actualizarTodo() {
  document.querySelectorAll(".ramo").forEach(div => {
    const id = parseInt(div.dataset.id);
    const ramo = ramos.find(r => r[0] === id);
    updateRamoStyle(div, id, ramo[3]);
  });
}

function updateRamoStyle(div, id, requisitos) {
  div.classList.remove("aprobado", "bloqueado");

  if (aprobados.includes(id)) {
    div.classList.add("aprobado");
  } else if (requisitos.some(req => !aprobados.includes(req))) {
    div.classList.add("bloqueado");
  }
}

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  mensaje.classList.remove("mensaje-oculto");

  setTimeout(() => {
    mensaje.classList.add("mensaje-oculto");
  }, 4000);
}

