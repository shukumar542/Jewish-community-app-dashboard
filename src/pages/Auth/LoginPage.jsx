import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Text from "../../components/Text";
import Inputbox from "../../components/InputBox";
import { useLoginMutation } from "../../redux/api/authApi";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await login({ email: email.trim(), password }).unwrap();

      const token = res?.data?.accessToken;
      console.log(res?.data?.accessToken)

      if (token) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("token", token);

        const user = res?.user || res?.data?.user;
        if (user) storage.setItem("user", JSON.stringify(user));
      }

      toast.success(res?.message || "Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-150">
        <div className="text-center mb-8">
          <Text
            text="Login to your account"
            className="text-2xl font-bold text-gray-800"
          />
          <p className="text-sm text-gray-500 mt-2">
            Please enter your email and password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Inputbox
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Inputbox
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition-colors">
                Remember me
              </span>
            </label>

            <Link
              to="/forgetPassword"
              title="Reset your password"
              className="font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#F7B115] text-white rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;