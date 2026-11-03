import SignupForm from "../CustomComponent/SignupForm";

export default function SignupPage() {
  return (
    <main
      className="
        min-h-screen
        bg-cover
        bg-center
        bg-fixed
        bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]
        py-8
        px-4
      "
      aria-label="Signup page background (decorative)"
      role="main"
    >
      <div className="bg-white/95 p-8 md:p-12 rounded-2xl shadow-2xl max-w-4xl w-full mx-auto backdrop-blur-sm">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          Create Your Account
        </h1>

        <SignupForm />
      </div>
    </main>
  );
}
