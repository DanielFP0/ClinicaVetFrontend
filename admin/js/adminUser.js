document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:8080";  
    const userTable = document.getElementById("userTable");
    const token = localStorage.getItem("token"); 


    async function fetchMedicos() {
        try {
            const response = await fetch(`${API_URL}/MedicoVeterinario/getAllMedicoVeterinario`, {
                method: "GET",  
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const medicos = await response.json();  
              
                userTable.innerHTML = "";
                
                for (const medico of medicos) {

                    const responseUser = await fetch(`${API_URL}/Usuario/getUsuario/${medico.id}`, {
                        method: "GET",  
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
            
                    if (responseUser.ok) {
                        const userDetails = await responseUser.json();
            
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${userDetails.id}</td>
                            <td>${userDetails.nomeCompleto}</td>
                            <td>${userDetails.login}</td>
                            <td>${medico.crm}</td>
                            <td>
                                <button class="btn btn-warning" onclick="editUser(${userDetails.id})">Editar</button>
                                <button class="btn btn-danger" onclick="deleteUser(${userDetails.id})">Excluir</button>
                            </td>
                        `;
                        userTable.appendChild(row);
                    } else {
                        console.error(`Erro ao buscar detalhes do médico com ID ${medico.id}:`, responseUser.statusText);
                    }
                }
            } else {
                alert("Erro ao carregar a lista de médicos.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao conectar à API.");
        }
    }

    function addUser() {
        window.location.href = "addMedico.html"; 
    }

    function editUser(id) {
        console.log(`Editar médico com ID: ${id}`);
    }

    function deleteUser(id) {
        console.log(`Excluir médico com ID: ${id}`);
    }

    fetchMedicos();
});
