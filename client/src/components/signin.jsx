import '../styles/sign.css';
import { context } from '../index';
import { useContext, useState } from 'react';
import { useNavigate} from "react-router-dom";
import { Loader } from './loader';
export const SignIn = () => {
    const {setCompleteUserData, setIsNewUser}=useContext(context);
    const navigate = useNavigate();
    const [errMessage,setErrMessage]=useState(null);
    const [isLoading,setIsLoading]=useState(false);
    const [formData, setFormData] = useState({
        mail: '',
        password: ''
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleCreateAccount = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if(!formData.mail||!formData.mail.includes('@gmail.com')){
            setIsLoading(false);
            return setErrMessage("Please enter a valid mail.")
        }
        if(!formData.password){
            setIsLoading(false);
            return setErrMessage("Please enter password")
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/signin`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            let message = await response.json();
            if(message.message==="success"){
                await setCompleteUserData(message.completeUserData);
                setIsLoading(false);
                navigate("/");
            }
            setErrMessage(message.message);
            setIsLoading(false);
            setIsNewUser(message.new);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return <main className="signMainContainer flex flexColumn alignCenter justifyCenter">
        <div className="signContainer flex spaceBetween alignCenter w50">
            <div className="signMessageContainer">
                <h3>Your Go-To Source for </h3>
                <h2>Managing Payments</h2>
                <p>Manage all your client's payments at one place with ease</p>
            </div>
            <form className="signFormContainer flex flexColumn w50" method="POST" onSubmit={handleCreateAccount}>
                <h3>Create an Account / Sign In</h3>
                <input type="mail" name='mail' placeholder="Enter your Mail ID" onChange={handleChange} value={formData.mail}/>
                <br />
                <input type="password" name='password' placeholder="Set your password" onChange={handleChange} value={formData.password}/>
                <br />
                {isLoading?<Loader component="signIn"/>:<button>Continue</button>  }              
                {errMessage&&<p className='errorMessage'>{errMessage}</p>}
            </form>
        </div>
        <p>Designed and Developed by <a href="https://abhiram945.github.io/portfolio" target='_blank' rel="noreferrer">Abhi</a><span> &#8599;</span></p>
    </main>
}
