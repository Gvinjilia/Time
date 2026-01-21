import AdminSidebar from "./AdminSidebar";

const AppSidebar = ({ activeSection, setSection }) => {
  return (
    <div>
        <AdminSidebar activeSection={activeSection} setSection={setSection} />
    </div>
  );
}


export default AppSidebar;