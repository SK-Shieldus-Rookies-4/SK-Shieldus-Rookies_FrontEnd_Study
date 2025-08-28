//node, express 로 구성한 restful webservice
const express = require('express');
const cors = require('cors');

const port = 4500;
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

let nextId = 6;

let rates = [
    {
        "id": 1,
        "name": "30 years fixed",
        "rate": "3.0",
        "years": "30"
    },
    {
        "id": 2,
        "name": "20 years fixed",
        "rate": "2.8",
        "years": "20"
    },
    {
        "id": 3,
        "name": "15 years fixed",
        "rate": "2.5",
        "years": "15"
    },
    {
        "id": 4,
        "name": "10 years fixed",
        "rate": "1.5",
        "years": "10"
    },
    {
        "id": 5,
        "name": "5 years fixed",
        "rate": "1.2",
        "years": "5"
    }
];

//rate 전체 조회
app.get('/api/rates', (req, res) => {
    setTimeout(() => {
        res.send(rates);
    }, 1000);
});

//rate 1개 조회
app.get('/api/rates/:id', (req, res) => {
    const rate = rates.find(rate => rate.id == req.params.id);

    if (rate) {
        res.status(200).json(rate);
    } else {
        res.status(404).send({ error: 'Rate Not Found' });
    }
});

//rate 등록
app.post('/api/rates', (req, res) => {
    const rate = { id: getNextId(), ...req.body };
    rates = [...rates, rate];
    console.log('post ', rates);
    res.send(rates);
});

//rate 수정
app.put('/api/rates/:id', (req, res) => {
    var id = Number(req.params.id);

    const rateIndex = rates.findIndex(f => f.id == id);

    if (rateIndex > -1) {
        const rate = { ...rates[rateIndex], ...req.body };

        rates = [
            ...rates.slice(0, rateIndex),
            rate,
            ...rates.slice(rateIndex + 1),
        ];

        console.log('put ', rates);
        res.send(rates);
    } else {
        res.status(404).send({ error: 'Rate Not Found' });
    }
});

//rate 1개 삭제
app.delete('/api/rates/:id', function (request, response) {
    // 변수를 선언합니다.
    var id = Number(request.params.id);
    const rateIndex = rates.findIndex(f => f.id == id);

    if (isNaN(id)) {
        // 오류: 잘못된 경로
        response.status(400).send({
            error: '숫자를 입력하세요!'
        });
    } else if (rates[rateIndex]) {
        // 정상: 데이터 삭제
        rates.splice(rateIndex, 1);
        console.log('delete ', rates);
        response.send(rates);
    } else {
        // 오류: 요소가 없을 경우
        response.status(404).send({
            error: 'Rate Not Found!'
        });
    }
});

//rate 전체삭제
app.delete('/api/rates', (req, res) => {
    rates.splice(0, rates.length);
    res.send(rates);
});

function getNextId() {
    return nextId++;
}

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
