import React, { useState } from 'react'
import AuthImagePattern from '../components/AuthImagePattern'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, MessagesSquare } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import toast from 'react-hot-toast'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const { login, isLoggingIn } = useAuthStore();

    const validateForm = () => {
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!formData.password.trim()) return toast.error("Password is required");

        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const success = validateForm();
        if (success === true) {
            login(formData)
        }
    }
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessagesSquare className="size-6 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-3xl mb-2">Login to your account</h1>
                        <h3>Stay updated with the new Gossippp!</h3>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    className="w-full py-2 pl-10 border rounded-md"
                                    placeholder="johndoe@gmail.com"
                                    autoComplete='off'
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full py-2 pl-10 border rounded-md"
                                    placeholder="********"
                                    autoComplete='off'
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="size-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-950 transition-colors cursor-pointer"
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>

                    <div className='text-center'>
                        <p className='text-base'>Don't have an account? {" "}
                            <Link to="/signup" className='text-blue-600'>
                                create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <AuthImagePattern title="Welcome Back" subtitle="Let's gooo, straight into it" />
        </div>
    )
}

export default LoginPage