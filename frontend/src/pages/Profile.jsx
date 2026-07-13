import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"
import { setUser } from "@/redux/userSlice"
import { Loader2 } from "lucide-react"


function Profile() {
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(store => store.user)
    const params = useParams()
    const userId = params.userId
    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        address: user?.address || "",
        city: user?.city || "",
        zipCode: user?.zipCode || "",
        profilePic: user?.profilePic || "",
        role: user?.role || "",
    })

    const [file, setFile] = useState(null)
    const dispatch = useDispatch()
    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) }) //preview only
    }
    // main function
    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        const accessToken = localStorage.getItem('accessToken')
        

        try {
            // use FormData for text + file
            const formData = new FormData()
            formData.append('firstName', updateUser.firstName)
            formData.append('lastName', updateUser.lastName)
            formData.append('email', updateUser.email)
            formData.append('phoneNo', updateUser.phoneNo)
            formData.append('address', updateUser.address)
            formData.append('city', updateUser.city)
            formData.append('zipCode', updateUser.zipCode)
            formData.append('role', updateUser.role)

            if (file) {
                formData.append('file', file)// image file for backend multer
            }
            
            

            const res = await axios.put(`http://localhost:8000/api/v1/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `token ${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })
           
            
            
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setUser(res.data.user))
            }

        } catch (error) {
            
            console.log(error.response);
            toast.error("Failed to update profile")
        } finally{
            setLoading(false)
        }
    }
    return (
        <div className="mt-21 min-h-screen bg-gray-100">

            <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center pt-4 ">
                <TabsList className="bg-gray-200">
                    <TabsTrigger value="profile">profile</TabsTrigger>
                    <TabsTrigger value="orders">orders</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <div>
                        <div className='flex flex-col justify-center items-center   bg-gray-100'>
                            <h1 className='font-bold mb-7 text-2xl text-gray-800 '>Update Profile</h1>
                            <div className='w-full flex flex-col items-center sm:flex-row gap-10 justify-between sm:items-start px-7 max-w-2xl'>
                                {/* profile picture */}
                                <div className='flex flex-col items-center'>
                                    <img src={updateUser?.profilePic || "/user.png"} alt="profile" className='w-32 h-32 rounded-full object-cover border-4 border-pink-800' />
                                    {/* <img src="/shakeel.png" alt="profile" className='w-32 h-32 rounded-full object-cover border-4 border-pink-800' /> */}
                                    <Label className='mt-4 cursor-pointer bg-pink-600 text-white whitespace-nowrap px-4 py-2 rounded hover:bg-pink-700'>Change Picture
                                        <input type="file"
                                            accept='image/*'
                                            className='hidden'
                                            onChange={handleFileChange} />
                                    </Label>
                                </div>

                                {/* profile form */}
                                <form onSubmit={handleSubmit} className='space-y-4 shadow-lg p-5 rounded-lg bg-white'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <Label className='block text-sm font-medium'>First Name</Label>
                                            <Input
                                                type='text'
                                                name="firstName"
                                                placeholder="Shakeel"
                                                value={updateUser.firstName}
                                                onChange={handleChange}
                                                className='w-full border rounded-lg px-3 py-2 mt-1' />
                                        </div>
                                        <div>
                                            <Label className='block text-sm font-medium'>Last Name</Label>
                                            <Input
                                                type='text'
                                                name="lastName"
                                                placeholder="Rehman"
                                                value={updateUser.lastName}
                                                onChange={handleChange}
                                                className='w-full border rounded-lg px-3 py-2 mt-1' />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className='block text-sm font-medium'>Email</Label>
                                        <Input
                                            type='email'
                                            name="email"
                                            disabled
                                            value={updateUser.email}
                                            onChange={handleChange}
                                            className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed' />
                                    </div>
                                    <div>
                                        <Label className='block text-sm font-medium'>Phone Number</Label>
                                        <Input
                                            type='text'
                                            name="phoneNo"
                                            placeholder="Enter you Contact No"
                                            value={updateUser.phoneNo}
                                            onChange={handleChange}
                                            className='w-full border rounded-lg px-3 py-2 mt-1 ' />
                                    </div>
                                    <div>
                                        <Label className='block text-sm font-medium'>Address</Label>
                                        <Input
                                            type='text'
                                            name="address"
                                            placeholder="Enter you address"
                                            value={updateUser.address}
                                            onChange={handleChange}
                                            className='w-full border rounded-lg px-3 py-2 mt-1 ' />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className='block text-sm font-medium'>City</Label>
                                            <Input
                                                type='text'
                                                name="city"
                                                placeholder="Enter your city address"
                                                value={updateUser.city}
                                                onChange={handleChange}
                                                className='w-full border rounded-lg px-3 py-2 mt-1 ' />
                                        </div>
                                        <div>
                                            <Label className='block text-sm font-medium'>Zip Code</Label>
                                            <Input
                                                type='text'
                                                name="zipCode"
                                                placeholder="Enter your zip code"
                                                value={updateUser.zipCode}
                                                onChange={handleChange}
                                                className='w-full border rounded-lg px-3 py-2 mt-1 ' />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-lg ">
                                        {loading? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Please wait</>):('Update Profile')}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>orders</CardTitle>
                            <CardDescription>
                                Track performance and user engagement metrics. Monitor trends and
                                identify growth opportunities.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Page views are up 25% compared to last month.
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Profile
