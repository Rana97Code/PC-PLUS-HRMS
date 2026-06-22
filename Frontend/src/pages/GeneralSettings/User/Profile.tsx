import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import IconMail from '../../../components/Icon/IconMail';
import IconPhone from '../../../components/Icon/IconPhone';
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContex from '../../../context/UserContex';

const Profile = () => {
    const user = useContext(UserContex);
    const baseUrl = user.base_url;
    const headers = user.headers;
    const navigate = useNavigate();

    const [userId, setUserId] = useState<number | null>(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userImg, setUserImg] = useState('');
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState('');

    const defaultImage = '/assets/images/users/user-profile.jpeg';

    useEffect(() => {
        if (!user?.token) {
            navigate('/');
            return;
        }

        getUserDetails();
    }, []);

    const getUserDetails = async () => {
        try {
            const response = await axios.get(`${baseUrl}/get_me/${user?.email}`, { headers });
            const data = response.data;

            setUserId(data.id);
            setUserName(data.user_name || '');
            setUserEmail(data.user_email || '');
            setUserPhone(data.user_phone || '');
            setUserPassword(data.user_password || '');
            setUserImg(data.user_img || '');

            if (data.user_img) {
                setPreviewImage(`/assets/images/users/${data.user_img}`);
            } else {
                setPreviewImage(defaultImage);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setProfileFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!userId) {
            alert('User ID not found');
            return;
        }

        const userData = {
            id: userId,
            user_img: userImg || '',
            user_name: userName,
            user_phone: userPhone,
            user_email: userEmail,
            user_password: userPassword,
        };

        const formData = new FormData();

        formData.append('user_name', userName);
        formData.append('user_email', userEmail);
        formData.append('user_phone', userPhone);
        formData.append('user_password', userPassword);

        if (profileFile) {
            formData.append('file', profileFile);
        }

        // formData.append('user', JSON.stringify(userData));

        if (profileFile) {
            formData.append('file', profileFile);
        }

        try {
            await axios.put(`${baseUrl}/update_user/${userId}`, formData, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Profile updated successfully');
            navigate('/index');
        } catch (error: any) {
            console.error('Profile update error:', error);
            alert(error?.response?.data?.detail || 'Profile update failed');
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 mb-5">
                <div>
                    <h2 className="text-xl font-bold">Profile Information</h2>
                    <p className="text-sm text-white-dark">Manage your personal account information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <div className="panel lg:col-span-1">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative">
                            <img
                                src={previewImage || defaultImage}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow"
                            />
                        </div>

                        <h3 className="font-bold text-xl text-primary mt-4">{userName}</h3>
                        <p className="text-sm text-white-dark">User ID: {userId}</p>

                        <div className="w-full mt-6 space-y-4">
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#1b2e4b] rounded p-3">
                                <IconMail className="w-5 h-5 text-primary" />
                                <span className="text-sm break-all">{userEmail}</span>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#1b2e4b] rounded p-3">
                                <IconPhone />
                                <span className="text-sm">{userPhone}</span>
                            </div>
                        </div>

                        <button type="button" className="btn btn-success mt-6 gap-2">
                            <img src="/assets/images/change-password.svg" alt="" className="w-6 h-6" />
                            Change Password
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="panel">
                        <div className="mb-7">
                            <h5 className="font-semibold text-lg dark:text-white-light">Update Profile</h5>
                            <p className="text-sm text-white-dark">Update your name, email, phone and profile image</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label>User Name</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="form-input"
                                        placeholder="Enter user name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        className="form-input"
                                        placeholder="Enter email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        value={userPhone}
                                        onChange={(e) => setUserPhone(e.target.value)}
                                        className="form-input"
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Profile Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="border rounded p-4 bg-gray-50 dark:bg-[#1b2e4b]">
                                <p className="text-sm text-white-dark">
                                    Current image:{' '}
                                    <span className="font-semibold text-primary">
                                        {userImg || 'No image uploaded'}
                                    </span>
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-6 pt-4">
                                <button type="submit" className="btn btn-primary gap-2">
                                    <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Update Profile
                                </button>

                                <Link to="/index">
                                    <button type="button" className="btn btn-danger gap-2">
                                        <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;