package main

import "testing"

func TestProduct(t *testing.T) {
	p := Product{Name: "MK-100", Category: "Клавиатуры", Price: 4990, OldPrice: 5990, InStock: true}
	if got := formatPrice(p.Price); got != "4\u00a0990\u00a0₽" {
		t.Fatalf("price = %q", got)
	}
	if r, pct := discount(p); r != 1000 || pct != 17 {
		t.Fatalf("discount = %d, %d%%", r, pct)
	}
	if status(p) != "В наличии" || shortDescription(p) != "MK-100 · Клавиатуры · 4\u00a0990\u00a0₽" {
		t.Fatal("unexpected product presentation")
	}
	p.InStock = false
	p.OldPrice = 0
	if r, pct := discount(p); r != 0 || pct != 0 || status(p) != "Недоступен для заказа" {
		t.Fatal("unexpected unavailable product presentation")
	}
}
