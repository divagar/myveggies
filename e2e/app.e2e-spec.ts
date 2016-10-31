import { MyveggiesPage } from './app.po';

describe('myveggies App', function() {
  let page: MyveggiesPage;

  beforeEach(() => {
    page = new MyveggiesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
