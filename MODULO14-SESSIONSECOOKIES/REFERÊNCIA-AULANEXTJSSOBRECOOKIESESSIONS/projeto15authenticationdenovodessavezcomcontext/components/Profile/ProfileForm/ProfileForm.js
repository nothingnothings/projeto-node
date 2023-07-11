import ProfileFormStyle from './ProfileForm.module.css';

const ProfileForm = () => {
  return (
    <form className={ProfileFormStyle.Form}>
      <div className={ProfileFormStyle.Control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" />
      </div>
      <div className={ProfileFormStyle.Control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" />
      </div>
      <div className={ProfileFormStyle.Action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
