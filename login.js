document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const API_URL = "http://localhost:8080"; 


    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();  

        const login = document.getElementById("login").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json", 
                },
                body: JSON.stringify({
                    login: login,
                    senha: password,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert("Login realizado com sucesso!");
                console.log("Resposta da API:", result);

                localStorage.setItem("token", result.token);
                localStorage.setItem("idUser", result.id);

                // Redirecionando com base na role do usuário
                if(result.role == 'ADMIN'){
                    window.location.href = "admin/dashboard.html";
                }
                else if(result.role == 'TUTOR'){
                    window.location.href = "tutor/dashboard.html";
                }
                else if(result.role == 'MEDICO'){
                    window.location.href = "medico/dashboard.html";
                }

            } else {
                const error = await response.json();
                alert(`Erro ao realizar login: ${error.message || "Verifique suas credenciais."}`);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Não foi possível conectar à API. Tente novamente mais tarde.");
        }
    });
});
