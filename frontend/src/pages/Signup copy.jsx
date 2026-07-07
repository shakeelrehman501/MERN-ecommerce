import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'

function Signup() {
    const [showPassword, setShowPassword] = useState(false)
   
    return (
        <div className='flex items-center justify-center bg-pink-100 min-h-screen'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter the details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className='grid grid-cols-2 gap-3'>
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="Shakeel"
                                    required
                                    className="py-4.5"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Rehman"
                                    required
                                    className="py-4.5"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className="py-4.5"
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <div className='relative'>
                                <Input id="password" name="password" placeholder="Create a password" type={`${showPassword ? "text" : "password"}`} required className="py-4.5" />
                                <div className='absolute right-4 top-1/2 -translate-y-1/2 flex'>
                                    {showPassword ? (
                                        <Eye onClick={() => setShowPassword(false)} className='w-5 h-5 text-gray-400 hover:cursor-pointer' />
                                    ) : (
                                        <EyeOff onClick={() => setShowPassword(true)} className='w-5 h-5 text-gray-400 hover:cursor-pointer' />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex-col gap-2 bg-white border-none">
                    <Button type="submit"  className="w-full cursor-pointer">
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Signup
