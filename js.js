var timer;
    var directx = direct = 0;
//Указываю количество клеток по вертикали и после по горизонтали 
    var fieldSizeX = 10;
    var fieldSizeY = 10;
    var KEY = {
        'left' : 37,
        'up' : 38,
        'right' : 39,
        'down' : 40
    };
//Массив направлений
    var direction = [
        [0,1], //вправо
        [1,0], //вниз
        [0,-1], //влево
        [-1,0]]; //вверх
//Задаю начальные параметры змеи
    var snake = {
        length : 2,
        body : [[6,5],[5,5]], //координаты расположения змеи
/* В этой функции рисую змею на экране*/
        initialisationSnake : function (){
//Цикл проходит по всем составным частям змеи
            for ( var i = 0; i < this.length; i++){
                var currentBodyPart = this.body[i];
/*Отрисовка происходит при помощи присвоения определенных стилевых правил cell и snake */
                document.getElementById(currentBodyPart.join()).className = 'cell snake';
            }
        },
        move : function (){
            direct = directx;
            var body = this.body //определяем тело ползучего животного
//Определяем его голову. В данном случае это последняя клетка
            var head = this.body[this.length-1];
            var headCell = head.map(function(value, index){ return value + direction[direct][index] });
            compareEatOrGameOver(headCell, body);
            return headCell;
        }
    };



//функция addEventListener регистрирует определенный обработчик событий
//и keyHandler сообщает какая кнопка была нажата
    window.addEventListener('keydown', keyHandler, false);
    prepareGamePane(fieldSizeX, fieldSizeY);

/*Подготавливаю игровое поле. Именно здесь прорисовываются клетки поля и расположение последнего */
    function prepareGamePane (fieldSizeX, fieldSizeY){
        for ( var x = 0; x < fieldSizeX; x++){
            var coordinateX = document.createElement('div');
            document.body.appendChild(coordinateX);
            coordinateX.className = 'field';
            for (var y = 0; y < fieldSizeY; y++){
                var coordinateY = document.createElement('div');
                coordinateX.appendChild(coordinateY);
                coordinateY.className = 'cell';
                coordinateY.id = x+','+y;
            }
        }
        snake.initialisationSnake();
        makeFood(fieldSizeX, fieldSizeY);
      }

//Генерирую случайную точку на поле, в которую и внесу еду
    function makeFood (fieldSizeX, fieldSizeY){
//Случайным образом получаю первую часть координаты по x
        var x = Math.round(Math.random() * (fieldSizeX-1));
//Случайным образом получаю первую часть координаты по y
        var y = Math.round(Math.random() * (fieldSizeY-1));
        var food = document.getElementById(x+','+y);
/*Осуществляю проверку. Если полученная координата не занята змеей, то рисую еду – красный квадрат*/
        if (food.className == 'cell'){
            food.className = "cell food";
        } else { //иначе запускаю функцию по новой
            makeFood(fieldSizeX, fieldSizeY);
        }
        return food;
    }
 
//Обработчик нажатой кнопки
    function keyHandler (event){
        switch (event.keyCode) {
            case KEY.left: //стрелка влево
                if (direct != 0){
                    directx = 2;
                }
                break;
            case KEY.right: //стрелка вправо
                if (direct != 2){
                    directx = 0;
                }
                break;
            case KEY.up: //стрелка вверх
                if (direct != 1){
                    directx = 3;
                }
                break;
            case KEY.down: //стрелка вниз
                if (direct != 3){
                    directx = 1;
                }
                break;
            default :
                return;
        }
    }


 
    function compareEatOrGameOver (headCell, body) {
        var tmp = document.getElementById(headCell.join());
/*Данная проверка позволяет не останавливаться ползучему существу, если оно доходит до края игрового поля*/
        if (tmp == null ) {
          if (headCell[0] == -1)
            headCell[0] = fieldSizeX - 1;
          if (headCell[0] == fieldSizeX)
            headCell[0] = 0;
          if (headCell[1] == -1)
            headCell[1] = fieldSizeY - 1;
          if (headCell[1] == fieldSizeY)
            headCell[1] = 0;
          tmp = document.getElementById(headCell.join());
        }
         //Если занята ячейка – это пустая клетка, то рисую там змею 
        if ( tmp != null && tmp.className == 'cell' ){
            var removeTail = body.shift();
            body.push(headCell);
            document.getElementById(removeTail.join()).className = 'cell';
            document.getElementById(headCell.join()).className = 'cell snake';
        } else { //если текущая клетка с едой
            if ( tmp != null && tmp.className == 'cell food'){
//увеличиваю длину змеи на 1 квадрат
                snake.length++;
                body.push(headCell);
                document.getElementById(headCell.join()).className = 'cell snake';
               
//генерирую еду в другой ячейке
                makeFood(fieldSizeX, fieldSizeY);
//Меняю количество очков
                var score = snake.length-2;
                document.getElementById('score').innerHTML = 'Ваш счет: '+score;

            } else { //если текущая ячейка оказалась самой змеей

                if (tmp.className == 'cell snake'){
       
                        clearInterval(timer);
                    }

                   

//вывод сообщения об окончании игры
                    alert('Вы проиграли! Ваш счет: ' + (snake.length-2) + '. Нажмите кнопку «Сбросить» для начала новой игры!');
                        
                }
            }
          }

        

 //Функции описания режима движения змейки
    function start () { //Простой
        timer = setInterval(function(){
            snake.move();
        },500);
    }

    function reload () {
        window.location.reload();
    }