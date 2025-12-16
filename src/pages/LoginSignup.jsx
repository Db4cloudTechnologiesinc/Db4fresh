import { useState } from 'react';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../features/auth/authSlice';

export default function LoginSignup(){
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const dispatch = useDispatch();

  async function submit(e){
    e.preventDefault();
    try {
      if (isLogin){
        const res = await api.post('/auth/login', form);
        if (res.data.token) dispatch(setAuth(res.data));
        else alert(res.data.msg || 'Login failed');
      } else {
        const res = await api.post('/auth/register', form);
        if (res.data._id) alert('Registered - please login');
        else alert(res.data.msg || 'Signup failed');
      }
    } catch(e){
      alert('Server not available - this demo uses mock data.');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={submit} className="space-y-3">
        {!isLogin && <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-2 border rounded" />}
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full p-2 border rounded" />
        <div className="flex justify-between items-center">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">{isLogin ? 'Login' : 'Signup'}</button>
          <button type="button" className="text-indigo-600" onClick={()=>setIsLogin(!isLogin)}>{isLogin ? 'Create account' : 'Already have account?'}</button>
        </div>
      </form>
    </div>
  );
}
