<p align="center">
  <img src="https://raw.githubusercontent.com/Catskhi/HiveMind.tmp/main/frontend/public/images/bee_pixel-export.svg" alt="Hivemind bee" width="250">
</p>

#  Hivemind.tmp

Hivemind.tmp is a secure real-time chat application built with Spring Boot for the backend and Next.Js for the frontend. It ensures user privacy through end-to-end encryption, where each message is secured using the recipient's public key, making it readable only by the intended recipient.

It started as a personal project to help me learn and explore the capabilities of Spring Boot, a framework I’m currently studying. Over time, I saw a lot of potential in the idea, and it will likely continue to receive updates and improvements in the future.

## 📸 Screenshots

![screenshoot 2](https://github.com/Catskhi/HiveMind.tmp/blob/main/assets/screenshoot2.png)
![screenshoot 1](https://github.com/Catskhi/HiveMind.tmp/blob/main/assets/screenshoot1.png)

## Features

- Real-time messaging using WebSockets
- End-to-end encryption for all messages
- User authentication and authorization
- Global chat and private messaging (group chats coming soon).
- Easy private key backup
- Authentication using JWT


## Tech Stack

**Client:**<br>
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)


**Server:**<br>
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)


**Deployment:**<br>
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
## 4. Hybrid Cryptography Explanation

HiveMind.tmp uses hybrid cryptography to securely encrypt all messages exchanged between users.

The application combines symmetric encryption, which is fast and efficient for encrypting the message content, with asymmetric encryption, which is used to securely share the symmetric keys between users.

🔄 Message Flow
When a user sends a message:

- A new symmetric key is generated (each message has its own key).

- The message is encrypted using the symmetric key.

- The symmetric key is encrypted using the recipient's public key.

- Both the encrypted symmetric key and the encrypted message are sent to the backend.

When the recipient receives a message:

- They use their private key to decrypt the symmetric key.

- The decrypted symmetric key is then used to decrypt the actual message content.

The following image explains the flow:

![screenshoot 1](https://github.com/Catskhi/HiveMind.tmp/blob/main/assets/img/Black%20board.png)


## 5 - Getting Started

### Prerequisites

Clone this repository
Make sure you have the following installed:

- [Java 21+](https://adoptopenjdk.net/)
- [Maven](https://maven.apache.org/)  (optional, if not using docker)
- [Node.js](https://nodejs.org/) (for the frontend)
- [Docker](https://www.docker.com/) (or locally configured instance of PostgreSQL)

### 📦 Backend Setup

1. **Clone the repository**
```
git clone https://github.com/Catskhi/HiveMind.tmp.git
```

2. Configure environment variables

In the backend folder, set up the following variables on the .env file:
```env
# Custom JWT secret
JWT_SECRET=""
# Database 
DB_URL=""
DB_USERNAME=""
DB_PASSWORD=""
# Allowed origins of the server CORS configuration
ALLOWED_ORIGINS=
# Your custom chat secret
CHAT_SECRET=
```

In the root folder, set up the following variables on the .env file:
```env
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
```

3. Start the application with Docker:
 ```
 docker-compose up
 ```

### 🌐 Frontend Setup

1. In the frontend folder, install the dependencies:
```
npm install
```

2. Set up the following environment variables:
```env
NEXT_PUBLIC_BACKEND_BASE_URL=
NEXT_PUBLIC_BACKEND_BASE_WEBSOCKET_URL=
```

3. Build and run the project:
```
npm run build && npm run start
```
## Usage/Examples

Once the application is running, you can:

1. Create an account and back-up your private key:
  - Create an account using your credentials.
- Copy your private key or save it as a file on the private key page.
2. **Send a Private Message:**
  - Log in with your credentials.
  - Select a user from the global chat list.
  - Type your message and hit send. The recipient will see it instantly!

## Contributing

I welcome contributions to HiveMind.tmp! To get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m "Add your message"`).
4. Push to your fork (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

Please ensure your code follows the existing style and includes tests where applicable.
