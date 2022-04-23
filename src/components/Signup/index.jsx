import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
	const [data, setData] = useState({
		name: "",
		lastname: "",
		rol: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/auth/signup";
			const res  = await axios.post(url, data);
			localStorage.setItem("token", res.data.token);
			navigate("/doctors");
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					{/* <h1>Welcome Back</h1> */}
					{/* <img src={'assets/layout/images/logo.jpg'} alt="logo" className={styles.logo}/> */}

					<Link to="/login">
						<button type="button" className={styles.white_btn}>
							Ingresar
						</button>
					</Link>
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Crear Cuenta</h1>
						<input
							type="text"
							placeholder="Nombre"
							name="name"
							onChange={handleChange}
							value={data.name}
							required
							className={styles.input}
						/>
						<input
							type="text"
							placeholder="Apellido"
							name="lastname"
							onChange={handleChange}
							value={data.lastname}
							required
							className={styles.input}
						/>
						<input
							type="text"
							placeholder="rol"
							name="rol"
							onChange={handleChange}
							value={data.rol}
							required
							className={styles.input}
						/>
						<input
							type="email"
							placeholder="Correo Electronico"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Contraseña"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Registrate
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;
