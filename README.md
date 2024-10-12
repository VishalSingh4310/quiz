# Quiz

Quiz backend repository which is setup with nodejs and typescript for APIs

### Prerequisites

- Node.js( > v18.17.0) and npm (or yarn) installed on your system.

### Installation

1. Clone the repository:
```
git clone https://github.com/VishalSingh4310/quiz.git
```

2. Navigate into the repository:
```
cd quiz
```

3. Install Dependencies:
```
npm install
# or
yarn install
```

4. Create your .env file then copy paste .env.local file.


### Run the application 

You can run both frontend and backend concurrently using command:
```
npm run dev
# or
yarn dev
```
Or You can run both frontend and backend individually using command:

```
npm run backend
# or
yarn backend
```
then
```
npm run frontend
# or
yarn frontend
```

- Visit http://localhost:3000 in your browser to view the application.

### Linting and Formatting

This project uses ESLint and Prettier for linting and code formatting. To run linting and formatting scripts, use the following commands:

```
# Run ESLint
npm run lint
# or
yarn lint
```

### To Test the sample API

- First run the project by above command
- Then, open the postman or similar tool
- Add following URL `http://localhost:3001/` along with POST method
