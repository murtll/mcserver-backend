/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  await knex('items').insert([
    {id: 25, name: 'Разбан', picture: '/images/bans/unban.gif', category_id: '4', price: '399', command: 'unban %user%', min_number: 1, max_number: 1},
    {id: 26, name: 'Размут', picture: '/images/bans/unmute.gif', category_id: '4', price: '99', command: 'unmute %user%', min_number: 1, max_number: 1},
    {id: 27, name: '100 гемов', picture: '/images/money/money1.png', category_id: '3', price: '49', command: 'tm add %user% 100', min_number: 1, max_number: 1},
    {id: 28, name: '500 гемов', picture: '/images/money/external-content.duckduckgo.com.png', category_id: '3', price: '149', command: 'tm add %user% 500', min_number: 1, max_number: 1},
    {id: 29, name: '1000 гемов', picture: '/images/money/money2.png', category_id: '3', price: '249', command: 'tm add %user% 1000', min_number: 1, max_number: 1},
    {id: 30, name: '3000 гемов', picture: '/images/money/money3.png', category_id: '3', price: '599', command: 'tm add %user% 3000', min_number: 1, max_number: 1},
    {id: 31, name: 'Бравлер', picture: '/images/privileges/brawler.png', category_id: '2', price: '19', command: 'lp user %user% parent set brawler', min_number: 1, max_number: 1},
    {id: 32, name: 'Монке', picture: '/images/privileges/monke.png', category_id: '2', price: '99', command: 'lp user %user% parent set monke', min_number: 1, max_number: 1},
    {id: 33, name: 'Билли', picture: '/images/privileges/billy.png', category_id: '2', price: '299', command: 'lp user %user% parent set billy', min_number: 1, max_number: 1},
    {id: 34, name: 'Гигачад', picture: '/images/privileges/gigachad.png', category_id: '2', price: '499', command: 'lp user %user% parent set gigachad', min_number: 1, max_number: 1},
    {id: 35, name: 'Анонимус', picture: '/images/privileges/anonimous.png', category_id: '2', price: '899', command: 'lp user %user% parent set anonymous', min_number: 1, max_number: 1},
    {id: 36, name: 'Пабло', picture: '/images/privileges/pablo.png', category_id: '2', price: '1499', command: 'lp user %user% parent set pablo', min_number: 1, max_number: 1},
    {id: 37, name: 'Леон', picture: '/images/privileges/leon.png', category_id: '2', price: '2499', command: 'lp user %user% parent set leon', min_number: 1, max_number: 1},
    {id: 38, name: 'Dungeon Master', picture: '/images/privileges/master.png', category_id: '2', price: '5499', command: 'lp user %user% parent set dmaster', min_number: 1, max_number: 1},
    {id: 39, name: 'Кейс с Золотом', picture: '/images/cases/case3.png', category_id: '1', price: '9', command: 'treasures keys %user% goldcase add %number%', min_number: 1, max_number: 1},
    {id: 40, name: 'Кейс с Привилегиями', picture: '/images/cases/case-priv22.png', category_id: '1', price: '49', command: 'treasures keys %user% privilegescase add %number%', min_number: 1, max_number: 100},
    {id: 41, name: 'Кейс с Гемами', picture: '/images/cases/case-gems.png', category_id: '1', price: '49', command: 'treasures keys %user% gemcase add %number%', min_number: 1, max_number: 100},
    {id: 42, name: 'Кейс с Леоном', picture: '/images/cases/case4.png', category_id: '1', price: '39', command: 'treasures keys %user% leoncase add %number%', min_number: 1, max_number: 100},
    {id: 62, name: 'Кейс с Питомцами', picture: '/images/cases/case-squick(1).png', category_id: '1', price: '99', command: 'treasures keys %user% pets add %number%', min_number: 1, max_number: 100},
    {id: 64, name: '5000 гемов', picture: '/images/money/money4.png', category_id: '3', price: '899', command: 'tm add %user% 5000', min_number: 1, max_number: 1},
    {id: 65, name: '10000 гемов', picture: '/images/money/gems.png', category_id: '3', price: '1499', command: 'tm add %user% 10000', min_number: 1, max_number: 1},
    {id: 66, name: 'BrawlPass', picture: '/images/special/brawlpass-res.png', category_id: '4', price: '299', command: 'bpa set pass %user% premium', min_number: 1, max_number: 1},
  ]);

  await knex('items')
          .where({id: 31})
          .update({
            description: '<ul><br><li>Префикс <b style="color: blue;">Бравлер</b> в чате/табе/над головой<br><br><hr><br><li>Надеть любой блок на голову - <Code style="color: lightblue;">/hat</Code><br><li>Включить режим АФК - <Code style="color: lightblue;">/afk</Code><br><li>Открыть личный верстак - <Code style="color: lightblue;">/workbench</Code><br><li>Посмотреть текущее время - <Code style="color: lightblue;">/time</Code><br><li>Зарплата (<a style="color: gold;">200 ❖</a>)<br><br><hr><br><li>Набор Бравлер - <Code style="color: lightblue;">/kit brawler</Code><br><li>Дополнительных слотов на аукционе <b>+2</b><br><li>Доступных точек дома <b>2</b><br><li>Доступно <b>2</b> региона для привата - <Code style="color: lightblue;">/rg claim</Code>'
          })
  await knex('items')
          .where({id: 32})
          .update({
            description: '<ul><br><li>Префикс <b style="color: tomato;">Монке</b> в чате/табе/над головой<br><li>Возможности предыдущего доната<br><br><hr><br><li>Утолить голод - <Code style="color: lightblue;">/feed</Code><br><li>Игнорировать игрока - <Code style="color: lightblue;">/ignore</Code><br><li>Открыть личный эндер-сундук - <Code style="color: lightblue;">/ec</Code><br><li>Информация о состоянии сервера - <Code style="color: lightblue;">/status</Code><br><li>Зарплата (<a style="color: gold;">500 ❖</a>)<br><br><hr><br><li>Набор <b>Монке</b> - <Code style="color: lightblue;">/kit monke</Code><br><li>Дополнительных слотов на аукционе <b>+5</b><br><li>Доступных точек дома <b>3</b><br><li>Доступно <b>3</b> региона для привата - <Code style="color: lightblue;">/rg claim</Code><br>'
          })
  await knex('items')
          .where({id: 33})
          .update({
            description: '<ul><br><li>Префикс <b style="color: Magenta;">Билли</b> в чате/табе/над головой<br><li>Возможности предыдущего доната<br><br><hr><br><li>Установить личное время - <Code style="color: lightblue;">/ptime</Code><br><li>Потушить себя - <Code style="color: lightblue;">/ext</Code><br><li>Найти игрока поблизости - <Code style="color: lightblue;">/near</Code><br><li>Количество игроков на сервере - <Code style="color: lightblue;">/list</Code><br><li>Очистить инвентарь - <Code style="color: lightblue;">/clear</Code><br><li>Зарплата (<a style="color: gold;">800 ❖</a>)<br><br><hr><br><li>Набор Билли - <Code style="color: lightblue;">/kit billy</Code><br><li>Дополнительных слотов на аукционе <b>+8</b><br><li>Доступных точек дома <b>5</b><br><li>Доступно <b>5</b> региона для привата - <Code style="color: lightblue;">/rg claim</Code>'
          })
  await knex('items')
          .where({id: 34})
          .update({
            description: '<ul><br><li>Префикс <b style="color: DodgerBlue;">Гигачад</b> в чате/табе/над головой<br><li>Возможности предыдущего доната<br><br><hr><br><li>Временный бан - <Code style="color: lightblue;">/tempban</Code><br><li>Информация о себе - <Code style="color: lightblue;">/info</Code><br><li>Установить солнечную погоду на сервере - <Code style="color: lightblue;">/sun</Code><br><li>Установить дождливую погоду на сервере - <Code style="color: lightblue;">/rain</Code><br><li>Установить штормовую погоду на сервере - <Code style="color: lightblue;">/storm</Code><br><li>Посмотреть настоящий ник - <Code style="color: lightblue;">/realname</Code><br><li>Зарплата (<a style="color: gold;">1.900 ❖</a>)<br><br><hr><br><li>Набор Гигачад - <Code style="color: lightblue;">/kit giga</Code><br><li>Дополнительных слотов на аукционе <b>+13</b><br><li>Доступных точек дома <b>7</b><br><li>Доступно <b>7</b> региона для привата - <Code style="color: lightblue;">/rg claim</Code><br>'
          })
  await knex('items')
          .where({id: 35})
          .update({
            description: '<ul><br><li>Префикс <b style="color: Yellow;">Анонимус</b> в чате/табе/над головой<br><li>Возможности предыдущего доната<br><br><hr><br><li>Изменить ник - <Code style="color: lightblue;">/nick</Code><br><li>Установить день на сервере - <Code style="color: lightblue;">/day</Code><br><li>Установить ночь на сервере - <Code style="color: lightblue;">/night</Code><br><li>Посмотреть инвентарь игрока - <Code style="color: lightblue;">/inv</Code><br><li>Читать чужие сообщения - <Code style="color: lightblue;">/socialspy</Code><br><li>Создать варп - <Code style="color: lightblue;">/setwarp</Code><br><li>Удалить варп - <Code style="color: lightblue;">/delwarp</Code><br><li>Писать объявления - <Code style="color: lightblue;">/bc</Code><br><li>Зарплата (<a style="color: gold;">2.800 ❖</a>)<br><br><hr><br><li>Набор Анонимус <Code style="color: lightblue;">/kit anonymous</Code><br><li>Дополнительных слотов на аукционе <b>+18</b><br><li>Доступных точек дома <b>10</b><br><li>Доступно <b>10</b> региона для привата - <Code style="color: lightblue;">/rg claim</Code><br><li>Доступно 3 варпа'
          })
  await knex('items')
          .where({id: 36})
          .update({
            description: '<ul><br><li>Префикс <b style="color: SpringGreen;">Пабло</b> в чате/табе/над головой<br><li>Возможности предыдущего доната<br><br><hr><br><li>Снять мут с игрока - <Code style="color: lightblue;">/unmute</Code><br><li>Починить предмет в руке - <Code style="color: lightblue;">/repair</Code><br><li>Читать сообщения игрока - <Code style="color: lightblue;">/socialspy</Code><br><li>Информация о других игроках - <Code style="color: lightblue;">/whois</Code><br><li>Отключение запросов на телепортацию - <Code style="color: lightblue;">/tptoggle</Code><br><li>Исцелить себя - <Code style="color: lightblue;">/heal</Code><br><li>Зарплата (<a style="color: gold;">4.000 ❖</a>)<br><br><hr><br><li>Набор Пабло - <Code style="color: lightblue;">/kit pablo</Code><br><li>Дополнительных слотов на аукционе <b>+25</b><br><li>Доступных точек дома <b>15</b><br><li>Доступно <b>15</b> региона для привата - <Code style="color: lightblue;">/rg claim</Code><br><li>Доступно 5 варпов'
          })
  await knex('items')
          .where({id: 37})
          .update({
            description: '<ul><br><li>Префикс <b style="color: Orange;">Леон</b> в чате/табе/над головой<br><li>Возможности предыдущего доната<br><br><hr><br><li>Летать - <Code style="color: lightblue;">/fly</Code><br><li>Поджечь игрока - <Code style="color: lightblue;">/burn</Code><br><li>Отключить сообщения - <Code style="color: lightblue;">/msgtoggle</Code><br><li>Замутить игрока - <Code style="color: lightblue;">/mute</Code><br><li>Исцелить игрока - <Code style="color: lightblue;">/heal</Code><br><li>Посадить игрока в тюрьму - <Code style="color: lightblue;">/jail</Code><br><li>Вытащить игрока из тюрьмы - <Code style="color: lightblue;">/unjail</Code><br><li>Починить все предметы - <Code style="color: lightblue;">/repair all</Code><br><li>Зарплата (<a style="color: gold;">5.000 ❖</a>)<br><br><hr><br><li>Набор Леон - <Code style="color: lightblue;">/kit leon</Code><br><li>Дополнительных слотов на аукционе <b>+38</b><br><li>Доступных точек дома <b>27</b><br><li>Доступно <b>27</b> региона для привата - <Code style="color: lightblue;">/rg claim</Code><br><li>Доступно 8 варпов'
          })
  await knex('items')
          .where({id: 38})
          .update({
            description: '<ul><br><li>Префикс <b style="color: red;">Dungeon Master</b> в чате/табе/над головой<br><li>Возможности предыдущего доната<br><br><hr><br><li>Вход на полный сервер<br><li>Нет кика за АФК<br><li>Вас не могут кикнуть/замутить/забанить<br><li>Забанить игрока - <Code style="color: lightblue;">/ban</Code><br><li>Разбанить игрока - <Code style="color: lightblue;">/unban</Code><br><li>Кикнуть игрока - <Code style="color: lightblue;">/kick</Code><br><li>Изменить скорость - <Code style="color: lightblue;">/speed</Code><br><li>Ударить игрока молнией - <Code style="color: lightblue;">/smite</Code><br><li>Исчезнуть - <Code style="color: lightblue;">/vanish</Code><br><li>Зарплата (<a style="color: gold;">6.000 ❖</a>)<br><br><hr><br><li>Набор Dungeon Master - <Code style="color: lightblue;">/kit master</Code><br><li>Дополнительных слотов на аукционе <b>+50</b><br><li>Доступных точек дома <b>45</b><br><li>Доступно <b>45</b> региона для привата - <Code style="color: lightblue;">/rg claim</Code><br><li>Доступно 15 варпов'
          })
  await knex('items')
          .where({id: 39})
          .update({
            description: 'Выпадает от <a style="color: gold;">100 ❖</a> до <a style="color: gold;">3000 ❖</a> золота'
          })
  await knex('items')
          .where({id: 40})
          .update({
            description: 'Выпадает любая привилегия.'
          })
  await knex('items')
          .where({id: 41})
          .update({
            description: 'Выпадает от <a style="color: lightgreen;">10 ◈</a> до <a style="color: lightgreen;">500 ◈</a> гемов.'
          })
  await knex('items')
          .where({id: 42})
          .update({
            description: 'Выпадает привилегия <b style="color: Orange;">Леон</b> с низким шансом или от <a style="color: lightgreen;" >10 ◈</a> до <a style="color: lightgreen;" >60 ◈</a> гемов c высоким шансом.'
          })
  await knex('items')
          .where({id: 62})
          .update({
            description: 'Выпадает любой питомец с одинаковыми шансами.'
          })
  await knex('items')
          .where({id: 66})
          .update({
            description: 'Увеличенное количество наград за сезон.'
          })
}
