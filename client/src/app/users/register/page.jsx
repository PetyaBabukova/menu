import RegisterForm from './registerForm';

export default function RegisterPage() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Регистрация на нов ресторант</h1>
      <RegisterForm />
    </div>
  );
}
