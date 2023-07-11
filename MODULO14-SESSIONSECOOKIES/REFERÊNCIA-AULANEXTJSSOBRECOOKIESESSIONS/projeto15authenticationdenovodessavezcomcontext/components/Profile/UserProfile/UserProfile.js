import ProfileForm from '../ProfileForm/ProfileForm';

import UserProfileStyle from './UserProfile.module.css';

const UserProfile = () => {
  ///REDIRECT AWAY IF __ NOT AUTH___ ...

  return (
    <section className={UserProfileStyle.Profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
};

export default UserProfile;
