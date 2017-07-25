/**
 * Created by RoGGeR on 14.06.17.
 */
app.controller('searchCtrl', function($rootScope,$http,$q,$location,myFactory){
    this.myFactory=myFactory;

    $rootScope.cacheTemplate={};
    var scope=this;
    this.isEmptyObject = function(obj) {//функция проверки объекта на пустоту
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    };

    this.searchFilter=function(values){

        for(var i=0; i<values.length; i++){
            var obj=values[i];
            $rootScope.cacheTemplate[obj.model]=obj.val;
        }

    };
    this.template={};//объект шаблон, необходимый для запроса к бд и дальнейшему решению искать ли в кэше или заново обращаться к бд
    this.checkTemplate=function(values){
        var obj;
        for(var i=0;i<values.length;i++){
            if(values[i].model===scope.template.model){

                obj=values[i];
                i=values.length;
            }
        }
        if(obj) return obj.val.search(scope.template.txt)==0;
        else return false;
    };
    this.search = function( values , type) {
        var data={};

        data.type=type;

        if(scope.abort){
            scope.abort.resolve();
        }
        scope.abort = $q.defer();
        var flag = values.find(function(element){// функция проверяет введено ли хоть в одно поле поиска значение, если нет - обнуляется массив
            return element.val != '' && element.val!=undefined && element.val.length>1
        });
        data.value=flag;

        scope.template.txt=flag.val;
        scope.template.model=flag.model;
        console.log(data);
        $http.post("search.php", data,{timeout:scope.abort.promise}).then(function success (response) {



                scope.myFactory.matrixType=type;



                $rootScope.search_result=response.data;
            },function error (response){
                console.log(response);
            }
        );
    };
    this.clean=function(){//очищаем все результаты поиска
        $rootScope.search_result=[];//<==== обнуляется массив
        scope.template={};
    };
    this.isEmptyQuery=function(values){

        var data={};
        data.values=values;
        var flag = data.values.find(function(element){// функция проверяет введено ли хоть в одно поле поиска значение, если нет - обнуляется массив
            return element.val != '' && element.val!=undefined && element.val.length>1
        });
        return flag;
    };


});