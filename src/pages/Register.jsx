import RegisterFrom from "../component/form/RegisterFrom";
import logo from "../assets/dingu_chat_application_logo.png";

function Register() {
  return (
    <div className="grid place-items-center h-screen bg-[#F9FAFB">
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={logo}
              alt="Learn with sumit"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <RegisterFrom></RegisterFrom>
        </div>
      </div>
    </div>
  );
}

export default Register;
