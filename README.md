# 🧠 Backend E-Commerce - Hexagonal Architecture + NestJS

Este proyecto es una API desarrollada con **NestJS**, utilizando los principios de la **Arquitectura Hexagonal (Ports & Adapters)**, con integración a **DynamoDB** como base de datos y pagos a través de **W\_\_i**. Los casos de uso siguen un enfoque de **Railway Oriented Programming (ROP)** para mejorar la legibilidad y robustez del flujo de errores.

---

## 📐 Arquitectura

- ✅ **Hexagonal Architecture (Ports & Adapters)**
- 🔁 **Railway Oriented Programming (ROP)** en los Use Cases
- 💡 **Clean Code** y separación de responsabilidades clara
- 🔒 Inyección de dependencias vía `@Inject`
- ⚡ **AWS DynamoDB** como base de datos NoSQL
- 💳 Integración con **W\_\_\_\_I** (sandbox)

---

## 🧩 Tecnologías

- 🚀 **NestJS** + TypeScript
- 🛠 **DynamoDB** (AWS)
- 🧪 **Jest** (testing + >80% cobertura)
- 🔐 **W\_\_i Gateway** (sandbox)
- 🧱 Docker ready (despliegue en ECS / ECR)

---

## 🔧 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxx
AWS_REGION=us-east-n

W__I_PRIVATE_KEY=xxxxxxxxxx
W__I_PUBLIC_KEY=xxxxxxxxxxxx
W__I_INTEGRITY_KEY=xxxxxxxxx
W__I_API_RUL=xxxxxxxxxx
```

Mirar el `.env-template` para corregir.

## 🧪 Comandos útiles

```bash
npm install	        # Instala dependencias.
npm run start:dev	# Inicia el proyecto.
npm run build       # Crear el build.
npm run test        # Ejeuta pruebas
npm run test:cov    # Ejecuta cobertura (>80%)
```

## 🧪 Pruebas

El proyecto utiliza Jest para pruebas unitarias.

```bash
npm run test
```

## 🧠 Créditos

Este proyecto fue desarrollado como prueba técnica para un e-commerce. Se implementaron las siguientes tecnologías y principios:

- **NestJS** + **TypeScript**
- **Arquitectura Hexagonal (Ports & Adapters)**
- **Railway Oriented Programming (ROP)** aplicado en los casos de uso
- **AWS DynamoDB** como base de datos NoSQL
- **W\_\_i** integración de pagos (entorno sandbox)
- **Docker** para empaquetado y despliegue en AWS ECS
- **Jest** para pruebas unitarias con >80% de cobertura
- **dotenv** para manejo seguro de variables de entorno
- Íconos de [fsymbols.com](https://fsymbols.com/)
- Buenas prácticas de **clean code**
