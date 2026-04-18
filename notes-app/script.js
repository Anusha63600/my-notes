let notes = JSON.parse(localStorage.getItem("notes")) || [];
notes = notes.map(note => {
  if (typeof note === "string") {
    return { text: note, important: false, date: new Date().toLocaleString() };
  }
  if (!note.date) {
    note.date = new Date().toLocaleString();
  }
  return note;
});

function addNote() {
  let input = document.getElementById("noteInput");
  let noteText = input.value.trim();

  if (noteText === "") {
    alert("Please enter a note");
    return;
  }

  let currentDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  notes.push({
    text: noteText,
    important: false,
    date: currentDate
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  input.value = "";
  displayNotes();
}

function displayNotes() {
  let list = document.getElementById("notesList");
  list.innerHTML = "";

  let searchValue = document.getElementById("searchInput")?.value.toLowerCase() || "";
  let sortedNotes = [...notes].sort((a, b) => b.important - a.important);
  sortedNotes.forEach((note, index) => {
    if (!note.text.toLowerCase().includes(searchValue)) return;

    let li = document.createElement("li");

    if (note.important) {
      li.classList.add("important-note");
    }

    li.innerHTML = `
  <div>
    <span class="${note.important ? 'important' : ''}">
      ${note.text}
    </span><br>
    <small>${note.date || ""}</small>
  </div>
  <div>
    <button onclick="toggleImportant(${notes.indexOf(note)})">
      ${note.important ? "⭐" : "☆"}
    </button>
    <button onclick="editNote(${notes.indexOf(note)})">Edit</button>
<span class="delete" onclick="deleteNote(${notes.indexOf(note)})">X</span>
  </div>
`;
    list.appendChild(li);
  });
}

function toggleImportant(index) {
  notes[index].important = !notes[index].important;

  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function editNote(index) {
  let newNote = prompt("Edit your note:", notes[index].text);

  if (newNote === null || newNote.trim() === "") return;

  notes[index].text = newNote.trim();

  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function searchNotes() {
  let searchValue = document.getElementById("searchInput").value.toLowerCase();
  let list = document.getElementById("notesList");
  let items = list.getElementsByTagName("li");

  for (let i = 0; i < items.length; i++) {
    let text = items[i].innerText.toLowerCase();

    if (text.includes(searchValue)) {
      items[i].style.display = "";
    } else {
      items[i].style.display = "none";
    }
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  let btn = document.getElementById("modeBtn");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
    btn.innerText = "☀️ Light Mode";
  } else {
    localStorage.setItem("mode", "light");
    btn.innerText = "🌙 Dark Mode";
  }
}

// Load saved mode
let btn = document.getElementById("modeBtn");

if (localStorage.getItem("mode") === "dark") {
  document.body.classList.add("dark");
  btn.innerText = "☀️ Light Mode";
} else {
  btn.innerText = "🌙 Dark Mode";
}



displayNotes();