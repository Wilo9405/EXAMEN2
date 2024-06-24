document.getElementById("comidaForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let comida = document.getElementById("comida").value;
    let calorias = document.getElementById("calorias").value;
    if (comida && calorias) {
      addComida(comida, calorias);
    } else {
      alert("Todos los campos son obligatorios.");
    }
  });
  
  function addComida(comida, calorias) {
    db.collection("comidas").add({
      comida: comida,
      calorias: calorias,
      gustada: null
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      getComidas();
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }
  
  function getComidas() {
    db.collection("comidas").get().then((querySnapshot) => {
      const comidasContainer = document.getElementById("comidasContainer");
      comidasContainer.innerHTML = "";
      querySnapshot.forEach((doc) => {
        const comida = doc.data();
        const comidaDiv = document.createElement("div");
        comidaDiv.className = `comida p-4 bg-white rounded shadow-md mb-4 ${comida.gustada ? "gustada" : comida.gustada === false ? "no-gustado" : ""}`;
        comidaDiv.innerHTML = `
          <span class="font-bold">${comida.comida} (${comida.calorias} calorías)</span>
          <div>
            <i onclick="marcarGusto('${doc.id}', true)" class="fas fa-thumbs-up p-2 ${comida.gustada ? "text-green-500" : "text-gray-300"} text-xl cursor-pointer mr-2"></i>
            <i onclick="marcarGusto('${doc.id}', false)" class="fas fa-thumbs-down p-2 ${comida.gustada === false ? "text-red-500" : "text-gray-300"} text-xl cursor-pointer mr-2"></i>
            <button onclick="deleteComida('${doc.id}')" class="p-2 bg-red-500 text-white rounded">Eliminar</button>
          </div>
        `;
        comidasContainer.appendChild(comidaDiv);
      });
    });
  }
  
  function deleteComida(id) {
    db.collection("comidas").doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
      getComidas();
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }
  
  function marcarGusto(id, gusto) {
    db.collection("comidas").doc(id).update({
      gustada: gusto
    })
    .then(() => {
      console.log("Document successfully updated!");
      getComidas();
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
  }
  
  function deleteAllComidas() {
    db.collection("comidas").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete().then(() => {
          console.log("Document successfully deleted!");
        }).catch((error) => {
          console.error("Error removing document: ", error);
        });
      });
      getComidas();
    }).catch((error) => {
      console.error("Error getting documents: ", error);
    });
  }
  
  window.onload = getComidas;
  