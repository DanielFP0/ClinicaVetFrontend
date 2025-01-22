document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:8080";  
    const consultaTable = document.getElementById("consultaTable");
    const token = localStorage.getItem("token"); 
    const idUser = localStorage.getItem("idUser"); 
console.log(token)
    async function fetchConsultas() {
        try {
            const response = await fetch(`${API_URL}/Consulta/getConsultaByMedico/${idUser}`, {
                method: "GET",  
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const consultas = await response.json();  
                consultaTable.innerHTML = "";

                for (const consulta of consultas) {
                    let medico, tutor, pet;

                    // Fetch informações do médico
                    const responseMedico = await fetch(`${API_URL}/Usuario/getUsuario/${consulta.idMedicoVeterinario}`, {
                        method: "GET",  
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    
                    if (responseMedico.ok) {
                        medico = await responseMedico.json();
                    } else {
                        console.error(`Erro ao buscar informações do médico: ${responseMedico.statusText}`);
                        continue;
                    }

                    // Fetch informações do tutor
                    const responseTutor = await fetch(`${API_URL}/Usuario/getUsuario/${consulta.idUsuario}`, {
                        method: "GET",  
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    
                    if (responseTutor.ok) {
                        tutor = await responseTutor.json();
                    } else {
                        console.error(`Erro ao buscar informações do tutor: ${responseTutor.statusText}`);
                        continue;
                    }

                    // Fetch informações do pet
                    const responsePet = await fetch(`${API_URL}/Pet/getPet/${consulta.idPet}`, {
                        method: "GET",  
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    
                    if (responsePet.ok) {
                        pet = await responsePet.json();
                    } else {
                        console.error(`Erro ao buscar informações do pet: ${responsePet.statusText}`);
                        continue;
                    }

                    // Criar uma nova linha para cada consulta
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${consulta.id}</td>
                        <td>${pet.nomeCompleto}</td>
                        <td>${tutor.nomeCompleto}</td>
                        <td>${new Date(consulta.dataConsulta).toLocaleDateString()}</td>
                        <td>${consulta.horaConsulta}</td>
                        <td>${medico.nomeCompleto}</td>
                        <td>
                            <button class="btn btn-warning" onclick="realizarConsulta(${consulta.id})">Realizar Consulta</button>
                        </td>
                    `;
                    consultaTable.appendChild(row);
                }
            } else {
                alert("Erro ao carregar a lista de consultas.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao conectar à API.");
        }
    }

    function realizarConsulta(id) {
        console.log(`Realizar consulta com ID: ${id}`);
    }

    fetchConsultas();
});
