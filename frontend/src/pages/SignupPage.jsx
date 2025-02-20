import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Lock, Mail, MessagesSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const { signup, isSigningIn } = useAuthStore();

    const validateForm = () => {
        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!formData.password.trim()) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters")

        return true
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const success = validateForm();

        if (success === true) signup(formData)
    };

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
                        <h1 className="text-3xl mb-2">Create Account</h1>
                        <h3>Get started with your free account</h3>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full py-2 pl-10 border rounded-md"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    autoComplete='off'
                                    onChange={(e) =>
                                        setFormData({ ...formData, fullName: e.target.value })
                                    }
                                />
                            </div>
                        </div>

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
                                disabled={isSigningIn}
                            >
                                {isSigningIn ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <div className='text-center'>
                        <p className='text-base'>Already have an account? {" "}
                            <Link to="/login" className='text-blue-600'>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <AuthImagePattern title="Join the community" subtitle="Connect with the anyone from anywhere..." />
        </div>
    );
};

export default SignupPage;