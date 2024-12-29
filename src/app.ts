import express from 'express';
import userRoutes from './routes/userRoutes';
import connectDB from "./config/db";
const app = express();

const PORT = process.env.PORT || 5000;
// connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;

