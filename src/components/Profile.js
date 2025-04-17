import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        preferences: {
            notifications: true,
            newsletter: true,
            theme: 'light'
        }
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setProfile(response.data);
            setFormData({
                name: response.data.name,
                email: response.data.email,
                phoneNumber: response.data.phoneNumber || '',
                address: response.data.address || '',
                preferences: response.data.preferences || {
                    notifications: true,
                    newsletter: true,
                    theme: 'light'
                }
            });
            setLoading(false);
        } catch (err) {
            setError('Error fetching profile');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('preferences.')) {
            const prefName = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    [prefName]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:5000/api/profile/update', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setProfile(response.data.user);
            setEditMode(false);
            setError(null);
        } catch (err) {
            setError('Error updating profile');
        }
    };

    const handleProfilePictureUpdate = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Here you would typically upload the file to a storage service
            // and get back a URL. For this example, we'll use a fake URL
            const fakeImageUrl = URL.createObjectURL(file);
            try {
                const response = await axios.put('http://localhost:5000/api/profile/update-picture', 
                    { profilePicture: fakeImageUrl },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        }
                    }
                );
                setProfile(response.data.user);
                setError(null);
            } catch (err) {
                setError('Error updating profile picture');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!isAuthenticated) return <div>Please log in to view your profile</div>;

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            
            <div className="profile-picture-section">
                <img 
                    src={profile?.profilePicture || user?.picture} 
                    alt="Profile" 
                    className="profile-picture"
                />
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfilePictureUpdate}
                    className="profile-picture-input"
                />
            </div>

            {!editMode ? (
                <div className="profile-info">
                    <p><strong>Name:</strong> {profile?.name}</p>
                    <p><strong>Email:</strong> {profile?.email}</p>
                    <p><strong>Phone:</strong> {profile?.phoneNumber || 'Not set'}</p>
                    <p><strong>Address:</strong> {profile?.address || 'Not set'}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Address:</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Preferences:</label>
                        <div className="preferences">
                            <label>
                                <input
                                    type="checkbox"
                                    name="preferences.notifications"
                                    checked={formData.preferences.notifications}
                                    onChange={handleInputChange}
                                />
                                Notifications
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="preferences.newsletter"
                                    checked={formData.preferences.newsletter}
                                    onChange={handleInputChange}
                                />
                                Newsletter
                            </label>
                            <label>
                                Theme:
                                <select
                                    name="preferences.theme"
                                    value={formData.preferences.theme}
                                    onChange={handleInputChange}
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile; 