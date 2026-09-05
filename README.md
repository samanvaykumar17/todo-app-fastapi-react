node --version  
npm --version  
npm create vite@latest frontend -- --template react  

cd frontend  
npm install  
npm run dev  


docker build -t todo-frontend .  
docker run -d --name todo-frontend -p 8080:80 todo-frontend  
http://localhost:8080  


docker build -t todo-backend .
docker run -d --name todo-backend -p 8000:8000 todo-backend