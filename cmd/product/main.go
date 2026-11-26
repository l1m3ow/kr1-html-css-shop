package main

import (
	"fmt"
	"strconv"
	"strings"
)

// Product — аналог объекта товара: строки, целые цены и признак наличия.
type Product struct {
	Name, Category  string
	Price, OldPrice int
	InStock         bool
}

func formatPrice(price int) string {
	digits := strconv.Itoa(price)
	var result strings.Builder
	for i, digit := range digits {
		if i > 0 && (len(digits)-i)%3 == 0 && digits[i-1] != '-' {
			result.WriteRune('\u00a0')
		}
		result.WriteRune(digit)
	}
	return result.String() + "\u00a0₽"
}

func discount(p Product) (rubles, percent int) {
	if p.OldPrice <= 0 || p.Price < 0 || p.Price >= p.OldPrice {
		return 0, 0
	}
	rubles = p.OldPrice - p.Price
	percent = int(float64(rubles)/float64(p.OldPrice)*100 + 0.5)
	return
}

func status(p Product) string {
	if p.InStock && p.Price > 0 {
		return "В наличии"
	}
	return "Недоступен для заказа"
}

func shortDescription(p Product) string {
	return fmt.Sprintf("%s · %s · %s", p.Name, p.Category, formatPrice(p.Price))
}

func main() {
	p := Product{Name: "Механическая клавиатура MK-100", Category: "Клавиатуры", Price: 4990, OldPrice: 5990, InStock: true}
	rubles, percent := discount(p)
	fmt.Println("Цена:", formatPrice(p.Price))
	fmt.Printf("Скидка: %s (%d%%)\n", formatPrice(rubles), percent)
	fmt.Println("Статус:", status(p))
	fmt.Println("Краткое описание:", shortDescription(p))
}
